import { useState, useMemo, useEffect } from 'react';
import { Plus, CheckSquare, LayoutGrid, List } from 'lucide-react';
import { useApp } from '../context/AppContext';
import TaskTable from '../components/tasks/TaskTable';
import TaskCard from '../components/tasks/TaskCard';
import TaskModal from '../components/tasks/TaskModal';
import SearchBar from '../components/ui/SearchBar';
import FilterPanel from '../components/ui/FilterPanel';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { SkeletonTable } from '../components/ui/Skeletons';
import { searchItems, filterItems, getDaysUntilDue } from '../utils/helpers';

export default function Tasks() {
  const { tasks, projects, user, addTask, updateTask, deleteTask } = useApp();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    projectId: 'all',
    dueDateFilter: 'all',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [deletingTask, setDeletingTask] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const projectsMap = useMemo(() => {
    return projects.reduce((acc, p) => {
      acc[p.id] = p;
      return acc;
    }, {});
  }, [projects]);

  const filteredTasks = useMemo(() => {
    let result = tasks;

    result = filterItems(result, {
      status: filters.status,
      priority: filters.priority,
      projectId: filters.projectId,
    });

    if (filters.dueDateFilter !== 'all') {
      result = result.filter(t => {
        const days = getDaysUntilDue(t.dueDate);
        if (days === null) return false;
        if (filters.dueDateFilter === 'overdue') return days < 0;
        if (filters.dueDateFilter === 'today') return days === 0;
        if (filters.dueDateFilter === 'thisWeek') return days >= 0 && days <= 7;
        return true;
      });
    }

    result = searchItems(result, searchQuery, ['title', 'assignee']);

    return result;
  }, [tasks, filters, searchQuery]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      status: 'all',
      priority: 'all',
      projectId: 'all',
      dueDateFilter: 'all',
    });
    setSearchQuery('');
  };

  const handleOpenAddModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = (task) => {
    setDeletingTask(task);
    setIsConfirmOpen(false);
    setTimeout(() => setIsConfirmOpen(true), 50);
  };

  const handleDeleteExecute = () => {
    if (deletingTask) {
      deleteTask(deletingTask.id);
      setIsConfirmOpen(false);
      setDeletingTask(null);
    }
  };

  const handleModalSubmit = (data) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
    } else {
      addTask(data);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/4 animate-pulse" />
        <SkeletonTable rows={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tasks</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Organize, assign, and track individual development tasks across projects.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
              title="Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search tasks by title or assignee..."
          />
        </div>
      </div>

      <FilterPanel
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        projects={projects}
        showProjectFilter={true}
        showDateFilter={true}
      />

      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title={searchQuery || Object.values(filters).some(v => v !== 'all') ? 'No Matching Tasks' : 'No Tasks Created'}
          description={
            searchQuery || Object.values(filters).some(v => v !== 'all')
              ? 'Try adjusting your search query or filter options.'
              : 'Add your first task to start organizing work.'
          }
          actionLabel={searchQuery || Object.values(filters).some(v => v !== 'all') ? 'Reset Filters' : 'Add Task'}
          onAction={searchQuery || Object.values(filters).some(v => v !== 'all') ? handleResetFilters : handleOpenAddModal}
        />
      ) : (
        <>
          <div className="hidden md:block">
            {viewMode === 'table' ? (
              <TaskTable
                tasks={filteredTasks}
                projectsMap={projectsMap}
                onEdit={handleOpenEditModal}
                onDelete={handleConfirmDelete}
                onStatusChange={(id, st) => updateTask(id, { status: st })}
                onPriorityChange={(id, pr) => updateTask(id, { priority: pr })}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTasks.map(t => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    projectName={projectsMap[t.projectId]?.name}
                    onEdit={handleOpenEditModal}
                    onDelete={handleConfirmDelete}
                    onStatusChange={(id, st) => updateTask(id, { status: st })}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="md:hidden space-y-3">
            {filteredTasks.map(t => (
              <TaskCard
                key={t.id}
                task={t}
                projectName={projectsMap[t.projectId]?.name}
                onEdit={handleOpenEditModal}
                onDelete={handleConfirmDelete}
                onStatusChange={(id, st) => updateTask(id, { status: st })}
              />
            ))}
          </div>
        </>
      )}

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
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
}
