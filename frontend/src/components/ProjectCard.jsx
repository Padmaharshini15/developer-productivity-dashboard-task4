import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

const ProjectCard = ({ project, onEdit, onDelete }) => {
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-lg">{project.title}</h3>
        <div className="flex gap-2">
          <button onClick={() => onEdit(project)} className="btn btn-outline" style={{ padding: '0.25rem' }}>
            <Edit2 size={16} />
          </button>
          <button onClick={() => onDelete(project.id)} className="btn btn-outline" style={{ padding: '0.25rem', color: 'var(--danger)' }}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <p className="text-muted text-sm">{project.description || 'No description provided.'}</p>
      <div className="mt-4 text-sm text-muted">
        Created: {new Date(project.created_at || Date.now()).toLocaleDateString()}
      </div>
    </div>
  );
};

export default ProjectCard;
