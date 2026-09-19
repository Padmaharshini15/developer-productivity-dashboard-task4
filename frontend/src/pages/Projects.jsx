import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectModal from '../components/projects/ProjectModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Loading from '../components/ui/LoadingSpinner';
import { SkeletonCard } from '../components/ui/Skeletons';
import EmptyState from '../components/common/EmptyState';
import { Plus, FolderKanban } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingProject, setDeletingProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const [projRes, tasksRes] = await Promise.all([
        api.get('/projects'),
        api.get('/tasks')
      ]);
      
      const tasks = tasksRes.data;
      
      const enhanced = projRes.data.map(p => {
        const projectTasks = tasks.filter(t => t.project_id === p.id);
        const taskCount = projectTasks.length;
        const completedTaskCount = projectTasks.filter(t => t.status === 'COMPLETED').length;
        const progress = taskCount === 0 ? 0 : Math.round((completedTaskCount / taskCount) * 100);
        
        return {
          ...p,
          name: p.title,
          progress,
          taskCount,
          completedTaskCount
        };
      });
      setProjects(enhanced);
    } catch (err) {
      setError('Failed to load projects.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (proj) => {
    setEditingProject(proj);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (data) => {
    try {
      const payload = {
        title: data.name,
        description: data.description,
        status: data.status || 'ACTIVE'
      };
      
      if (editingProject) {
        await api.put(`/projects/${editingProject.id}`, payload);
      } else {
        await api.post('/projects', payload);
      }
      await fetchProjects();
      closeModal();
    } catch (err) {
      console.error(err);
      alert('Failed to save project.');
    }
  };

  const handleConfirmDelete = (proj) => {
    setDeletingProject(proj);
    setIsConfirmOpen(true);
  };

  const handleDeleteExecute = async () => {
    if (deletingProject) {
      try {
        await api.delete(`/projects/${deletingProject.id}`);
        await fetchProjects();
      } catch (err) {
        alert('Failed to delete project.');
      } finally {
        setIsConfirmOpen(false);
        setDeletingProject(null);
      }
    }
  };

  const filteredProjects = projects.filter(p => 
    (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Projects</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage, track, and monitor all active development projects.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search projects by title or description..."
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}

      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title={searchQuery ? 'No Matching Projects' : 'No Projects Created'}
          description={
            searchQuery
              ? 'Try adjusting your search criteria.'
              : 'Get started by creating your first project to organize your development work.'
          }
          actionLabel={searchQuery ? 'Clear Search' : 'Add Project'}
          onAction={searchQuery ? () => setSearchQuery('') : handleOpenAddModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(proj => (
            <ProjectCard
              key={proj.id}
              project={proj}
              onView={() => {}}
              onEdit={handleOpenEditModal}
              onDelete={handleConfirmDelete}
            />
          ))}
        </div>
      )}

      <ProjectModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        project={editingProject}
      />

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Delete Project"
        message={`Are you sure you want to delete "${deletingProject?.name}"? This action cannot be undone.`}
        confirmLabel="Delete Project"
        onConfirm={handleDeleteExecute}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default Projects;
