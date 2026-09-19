import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import TaskCard from '../components/tasks/TaskCard';
import TaskModal from '../components/tasks/TaskModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Loading from '../components/ui/LoadingSpinner';
import { SkeletonCard } from '../components/ui/Skeletons';
import EmptyState from '../components/common/EmptyState';
import FilterPanel from '../components/ui/FilterPanel';
import SearchBar from '../components/ui/SearchBar';
import { Plus, CheckSquare } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Tasks = () => {
  const { user } = React.useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ status: 'all', priority: 'all', projectId: 'all' });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [location]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingTask, setDeletingTask] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksRes, projectsRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/projects')
      ]);
      const enhancedProjects = projectsRes.data.map(p => ({...p, name: p.title}));
      
      const enhancedTasks = tasksRes.data.map(t => {
        const proj = enhancedProjects.find(p => p.id === t.project_id);
        let status = 'Todo';
        if(t.status === 'IN_PROGRESS') status = 'In Progress';
        if(t.status === 'COMPLETED') status = 'Completed';
        
        let priority = 'Medium';
        if(t.priority === 'HIGH') priority = 'High';
        if(t.priority === 'LOW') priority = 'Low';

        return {
          ...t,
          status,
          priority,
          dueDate: t.due_date,
          projectName: proj ? proj.name : null,
          assignee: user ? user.name : null // Mocking assignee as current user
        };
      });
      
      setTasks(enhancedTasks);
      setProjects(enhancedProjects);
    } catch (err) {
      setError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (data) => {
    try {
      let dbStatus = 'TODO';
      if(data.status === 'In Progress') dbStatus = 'IN_PROGRESS';
      if(data.status === 'Completed') dbStatus = 'COMPLETED';
      
      let dbPriority = 'MEDIUM';
      if(data.priority === 'High') dbPriority = 'HIGH';
      if(data.priority === 'Low') dbPriority = 'LOW';

      const payload = {
        title: data.title,
        status: dbStatus,
        priority: dbPriority,
        due_date: data.dueDate || null,
        project_id: data.projectId || null
      };
      
      if (editingTask) {
        await api.put(`/tasks/${editingTask.id}`, payload);
      } else {
        await api.post('/tasks', payload);
      }
      await fetchData();
      closeModal();
    } catch (err) {
      alert('Failed to save task.');
    }
  };

  const handleConfirmDelete = (task) => {
    setDeletingTask(task);
    setIsConfirmOpen(true);
  };

  const handleDeleteExecute = async () => {
    if (deletingTask) {
      try {
        await api.delete(`/tasks/${deletingTask.id}`);
        await fetchData();
      } catch (err) {
        alert('Failed to delete task.');
      } finally {
        setIsConfirmOpen(false);
        setDeletingTask(null);
      }
    }
  };
  
  const handleStatusChange = async (taskId, newStatus) => {
      try {
        let dbStatus = 'TODO';
        if(newStatus === 'In Progress') dbStatus = 'IN_PROGRESS';
        if(newStatus === 'Completed') dbStatus = 'COMPLETED';
        await api.patch(`/tasks/${taskId}/status`, { status: dbStatus });
        await fetchData();
      } catch (err) {
        alert('Failed to update task status.');
      }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({ status: 'all', priority: 'all', projectId: 'all' });
    setSearchQuery('');
  };

  const filteredTasks = useMemo(() => {
    let result = tasks;
    if (searchQuery) {
        result = result.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (filters.status !== 'all') {
        result = result.filter(t => t.status === filters.status);
    }
    if (filters.priority !== 'all') {
        result = result.filter(t => t.priority === filters.priority);
    }
    if (filters.projectId && filters.projectId !== 'all') {
        result = result.filter(t => String(t.project_id) === String(filters.projectId));
    }
    return result;
  }, [tasks, filters, searchQuery]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/4 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tasks</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your to-dos, priorities, and deadlines across all projects.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search tasks..."
          />
        </div>
      </div>
      
      <FilterPanel
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        projects={projects}
        showProjectFilter={true}
        showDateFilter={false}
      />

      {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}

      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title={searchQuery || filters.status !== 'all' ? 'No Matching Tasks' : 'No Tasks Created'}
          description={
            searchQuery || filters.status !== 'all'
              ? 'Try adjusting your search criteria or filters.'
              : 'Create your first task to get started.'
          }
          actionLabel={searchQuery || filters.status !== 'all' ? 'Reset Filters' : 'Add Task'}
          onAction={searchQuery || filters.status !== 'all' ? handleResetFilters : handleOpenAddModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              projectName={task.projectName}
              onEdit={handleOpenEditModal}
              onDelete={handleConfirmDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      <TaskModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        task={editingTask}
        projects={projects}
        user={user}
      />

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Delete Task"
        message={`Are you sure you want to delete "${deletingTask?.title}"?`}
        confirmLabel="Delete Task"
        onConfirm={handleDeleteExecute}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default Tasks;
