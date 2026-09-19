export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatRelativeTime(dateString) {
  if (!dateString) return '';
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
}

export function getDaysUntilDue(dateString) {
  if (!dateString) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const due = new Date(dateString);
  due.setHours(0, 0, 0, 0);
  return Math.ceil((due - now) / 86400000);
}

export function getDeadlineUrgency(dateString) {
  const days = getDaysUntilDue(dateString);
  if (days === null) return 'none';
  if (days < 0) return 'overdue';
  if (days === 0) return 'today';
  if (days <= 3) return 'soon';
  if (days <= 7) return 'upcoming';
  return 'normal';
}

export function calculateProductivityScore(tasks, projects) {
  if (!tasks.length && !projects.length) return 0;

  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const totalTasks = tasks.length || 1;
  const taskCompletionRate = completedTasks / totalTasks;

  const onTimeTasks = tasks.filter(t => {
    if (t.status !== 'Completed' || !t.dueDate || !t.completedAt) return false;
    return new Date(t.completedAt) <= new Date(t.dueDate);
  }).length;
  const completedWithDue = tasks.filter(t => t.status === 'Completed' && t.dueDate).length;
  const onTimeRate = completedWithDue > 0 ? onTimeTasks / completedWithDue : 1;

  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const totalProjects = projects.length || 1;
  const projectRate = completedProjects / totalProjects;

  const score = Math.round(
    (taskCompletionRate * 50) + (onTimeRate * 30) + (projectRate * 20)
  );

  return Math.min(100, Math.max(0, score));
}

export function calculateProjectProgress(projectId, tasks) {
  const projectTasks = tasks.filter(t => t.projectId === projectId);
  if (projectTasks.length === 0) return 0;
  const completed = projectTasks.filter(t => t.status === 'Completed').length;
  return Math.round((completed / projectTasks.length) * 100);
}

export function getWeeklyProductivity(tasks) {
  const days = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const completed = tasks.filter(t => {
      if (!t.completedAt) return false;
      const completedDate = new Date(t.completedAt);
      return completedDate >= date && completedDate < nextDate;
    }).length;

    days.push({
      day: dayNames[date.getDay()],
      date: date.toISOString().split('T')[0],
      completed,
    });
  }

  return days;
}

export function getProductivityPercentage(tasks) {
  if (tasks.length === 0) return 0;
  const completed = tasks.filter(t => t.status === 'Completed').length;
  return Math.round((completed / tasks.length) * 100);
}

export function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export function sortByDate(items, key = 'createdAt', ascending = false) {
  return [...items].sort((a, b) => {
    const dateA = new Date(a[key] || 0);
    const dateB = new Date(b[key] || 0);
    return ascending ? dateA - dateB : dateB - dateA;
  });
}

export function filterItems(items, filters) {
  return items.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value || value === 'all') return true;
      return item[key] === value;
    });
  });
}

export function searchItems(items, query, keys) {
  if (!query || !query.trim()) return items;
  const lowerQuery = query.toLowerCase().trim();
  return items.filter(item =>
    keys.some(key => {
      const value = item[key];
      return value && value.toString().toLowerCase().includes(lowerQuery);
    })
  );
}
