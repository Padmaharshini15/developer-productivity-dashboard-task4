import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete, projects }) => {
  const getStatusBadge = (status) => {
    switch(status) {
      case 'IN_PROGRESS': return <span className="badge badge-inprogress">In Progress</span>;
      case 'COMPLETED': return <span className="badge badge-completed">Completed</span>;
      default: return <span className="badge badge-todo">To Do</span>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'HIGH': return <span className="badge badge-high">High</span>;
      case 'MEDIUM': return <span className="badge badge-medium">Medium</span>;
      default: return <span className="badge badge-low">Low</span>;
    }
  };

  const projectName = projects.find(p => p.id === task.project_id)?.title || 'No Project';

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">{task.title}</h3>
        <div className="flex gap-2">
          <button onClick={() => onEdit(task)} className="btn btn-outline" style={{ padding: '0.25rem' }}>
            <Edit2 size={16} />
          </button>
          <button onClick={() => onDelete(task.id)} className="btn btn-outline" style={{ padding: '0.25rem', color: 'var(--danger)' }}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      <div className="flex gap-2 mb-4">
        {getStatusBadge(task.status)}
        {getPriorityBadge(task.priority)}
      </div>

      <div className="text-sm text-muted">
        <div>Project: {projectName}</div>
        {task.due_date && <div>Due: {new Date(task.due_date).toLocaleDateString()}</div>}
      </div>
    </div>
  );
};

export default TaskCard;
