import { createContext, useContext, useCallback, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useToast } from './ToastContext';
import { STORAGE_KEYS, DEFAULT_SETTINGS, DEFAULT_USER } from '../utils/constants';
import { seedProjects, seedTasks, seedActivity } from '../data/seedData';
import { generateId, calculateProjectProgress } from '../utils/helpers';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [projects, setProjects] = useLocalStorage(STORAGE_KEYS.PROJECTS, seedProjects);
  const [tasks, setTasks] = useLocalStorage(STORAGE_KEYS.TASKS, seedTasks);
  const [activity, setActivity] = useLocalStorage(STORAGE_KEYS.ACTIVITY, seedActivity);
  const [settings, setSettings] = useLocalStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  const [user, setUser] = useLocalStorage(STORAGE_KEYS.USER, DEFAULT_USER);
  const toast = useToast();

  const addActivity = useCallback((type, message) => {
    const entry = {
      id: generateId(),
      type,
      message,
      timestamp: new Date().toISOString(),
    };
    setActivity(prev => [entry, ...prev].slice(0, 50));
  }, [setActivity]);

  const addProject = useCallback((projectData) => {
    const project = {
      ...projectData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProjects(prev => [project, ...prev]);
    addActivity('project_created', `Created project "${project.name}"`);
    toast.success(`Project "${project.name}" created successfully`);
    return project;
  }, [setProjects, addActivity, toast]);

  const updateProject = useCallback((id, updates) => {
    setProjects(prev => prev.map(p =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    ));
    addActivity('project_updated', `Updated project "${updates.name || 'project'}"`);
    toast.success('Project updated successfully');
  }, [setProjects, addActivity, toast]);

  const deleteProject = useCallback((id) => {
    const project = projects.find(p => p.id === id);
    setProjects(prev => prev.filter(p => p.id !== id));
    setTasks(prev => prev.filter(t => t.projectId !== id));
    addActivity('project_deleted', `Deleted project "${project?.name || 'project'}"`);
    toast.success('Project deleted successfully');
  }, [projects, setProjects, setTasks, addActivity, toast]);

  const addTask = useCallback((taskData) => {
    const task = {
      ...taskData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      completedAt: taskData.status === 'Completed' ? new Date().toISOString() : null,
    };
    setTasks(prev => [task, ...prev]);
    addActivity('task_created', `Created task "${task.title}"`);
    toast.success(`Task "${task.title}" created successfully`);
    return task;
  }, [setTasks, addActivity, toast]);

  const updateTask = useCallback((id, updates) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const updated = { ...t, ...updates };
      if (updates.status === 'Completed' && t.status !== 'Completed') {
        updated.completedAt = new Date().toISOString();
      }
      if (updates.status && updates.status !== 'Completed') {
        updated.completedAt = null;
      }
      return updated;
    }));
    addActivity('task_updated', `Updated task "${updates.title || 'task'}"`);
    toast.success('Task updated successfully');
  }, [setTasks, addActivity, toast]);

  const deleteTask = useCallback((id) => {
    const task = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(t => t.id !== id));
    addActivity('task_deleted', `Deleted task "${task?.title || 'task'}"`);
    toast.success('Task deleted successfully');
  }, [tasks, setTasks, addActivity, toast]);

  const updateSettings = useCallback((updates) => {
    setSettings(prev => ({ ...prev, ...updates }));
    toast.success('Settings updated successfully');
  }, [setSettings, toast]);

  const updateUser = useCallback((updates) => {
    setUser(prev => ({ ...prev, ...updates }));
    toast.success('Profile updated successfully');
  }, [setUser, toast]);

  const projectsWithProgress = useMemo(() => {
    return projects.map(p => ({
      ...p,
      progress: calculateProjectProgress(p.id, tasks),
      taskCount: tasks.filter(t => t.projectId === p.id).length,
      completedTaskCount: tasks.filter(t => t.projectId === p.id && t.status === 'Completed').length,
    }));
  }, [projects, tasks]);

  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'Active').length;
    const completedProjects = projects.filter(p => p.status === 'Completed').length;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const pendingTasks = tasks.filter(t => t.status !== 'Completed').length;
    const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
    const todoTasks = tasks.filter(t => t.status === 'Todo').length;
    const productivity = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      todoTasks,
      productivity,
    };
  }, [projects, tasks]);

  const value = useMemo(() => ({
    projects: projectsWithProgress,
    rawProjects: projects,
    tasks,
    activity,
    settings,
    user,
    stats,
    addProject,
    updateProject,
    deleteProject,
    addTask,
    updateTask,
    deleteTask,
    updateSettings,
    updateUser,
    addActivity,
  }), [
    projectsWithProgress, projects, tasks, activity, settings, user, stats,
    addProject, updateProject, deleteProject,
    addTask, updateTask, deleteTask,
    updateSettings, updateUser, addActivity,
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
