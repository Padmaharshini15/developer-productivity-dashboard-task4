import React from 'react';

const StatCard = ({ title, value, icon: Icon, color, subtitle }) => {
  const customColor = color || 'var(--primary)';
  return (
    <div className="stat-card">
      <div className="stat-header">
        <span>{title}</span>
        {Icon && (
          <div className="stat-icon-wrapper" style={{ backgroundColor: `${customColor}20` }}>
            <Icon size={20} color={customColor} />
          </div>
        )}
      </div>
      <div>
        <div className="stat-value">{value}</div>
        {subtitle && <div className="stat-subtitle">{subtitle}</div>}
      </div>
    </div>
  );
};

export default StatCard;
