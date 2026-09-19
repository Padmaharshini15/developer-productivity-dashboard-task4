import { useState, useMemo, useEffect } from 'react';
import { Plus, FolderKanban } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectModal from '../components/projects/ProjectModal';
import ProjectDetails from '../components/projects/ProjectDetails';
import SearchBar from '../components/ui/SearchBar';
import FilterPanel from '../components/ui/FilterPanel';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { SkeletonCard } from '../components/ui/Skeletons';
import { searchItems, filterItems } from '../utils/helpers';

export default function Projects() {
  const { projects, tasks, addProject, updateProject, deleteProject, updateTask, deleteTask } = useApp();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ status: 'all', priority: 'all' });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [selectedProject, setSelectedProject] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [deletingProject, setDeletingProject] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const filteredProjects = useMemo(() => {
    let result = projects;
    result = filterItems(result, filters);
    result = searchItems(result, searchQuery, ['name', 'description']);
    return result;
  }, [projects, filters, searchQuery]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({ status: 'all', priority: 'all' });
    setSearchQuery('');
  };

  const handleOpenAddModal = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (proj) => {
    setEditingProject(proj);
    setIsModalOpen(true);
  };

  const handleOpenDetails = (proj) => {
    setSelectedProject(proj);
    setIsDetailsOpen(true);
  };

  const handleConfirmDelete = (proj) => {
    setDeletingProject(proj);
    setIsConfirmOpen(true);
  };

  const handleDeleteExecute = () => {
    if (deletingProject) {
      deleteProject(deletingProject.id);
      setIsConfirmOpen(false);
      setDeletingProject(null);
    }
  };

  const handleModalSubmit = (data) => {
    if (editingProject) {
      updateProject(editingProject.id, data);
    } else {
      addProject(data);
    }
  };

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
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search projects by title or description..."
          />
        </div>
      </div>

      <FilterPanel
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        showProjectFilter={false}
        showDateFilter={false}
      />

      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title={searchQuery || filters.status !== 'all' || filters.priority !== 'all' ? 'No Matching Projects' : 'No Projects Created'}
          description={
            searchQuery || filters.status !== 'all' || filters.priority !== 'all'
              ? 'Try adjusting your search criteria or filters.'
              : 'Get started by creating your first project to organize your development work.'
          }
          actionLabel={searchQuery || filters.status !== 'all' || filters.priority !== 'all' ? 'Reset Filters' : 'Add Project'}
          onAction={searchQuery || filters.status !== 'all' || filters.priority !== 'all' ? handleResetFilters : handleOpenAddModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(proj => (
            <ProjectCard
              key={proj.id}
              project={proj}
              onView={handleOpenDetails}
              onEdit={handleOpenEditModal}
              onDelete={handleConfirmDelete}
            />
          ))}
        </div>
      )}

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        project={editingProject}
      />

      <ProjectDetails
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        project={selectedProject}
        tasks={tasks}
        onEditTask={() => {}}
        onDeleteTask={(t) => deleteTask(t.id)}
        onStatusChange={(id, st) => updateTask(id, { status: st })}
      />

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Delete Project"
        message={`Are you sure you want to delete "${deletingProject?.name}"? This action cannot be undone and will delete all associated tasks.`}
        confirmLabel="Delete Project"
        onConfirm={handleDeleteExecute}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
}
