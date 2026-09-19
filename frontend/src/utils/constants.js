export const TASK_STATUS = {
  TODO: 'Todo',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
};

export const TASK_PRIORITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};

export const PROJECT_STATUS = {
  ACTIVE: 'Active',
  ON_HOLD: 'On Hold',
  COMPLETED: 'Completed',
};

export const ROUTES = {
  DASHBOARD: '/dashboard',
  PROJECTS: '/projects',
  TASKS: '/tasks',
  ANALYTICS: '/analytics',
  PROFILE: '/profile',
  SETTINGS: '/settings',
};

export const STORAGE_KEYS = {
  PROJECTS: 'devdash_projects',
  TASKS: 'devdash_tasks',
  SETTINGS: 'devdash_settings',
  THEME: 'devdash_theme',
  ACTIVITY: 'devdash_activity',
  USER: 'devdash_user',
};

export const DEFAULT_SETTINGS = {
  theme: 'light',
  notifications: true,
  dashboardCompact: false,
  showCompletedTasks: true,
  defaultTaskView: 'table',
  defaultProjectView: 'grid',
};

export const DEFAULT_USER = {
  name: 'Padmaharshini A',
  email: 'padmaharshini@devdash.io',
  role: 'Full Stack Developer Intern',
  avatar: null,
  skills: ['React', 'Node.js', 'TypeScript', 'Python', 'AWS', 'Docker'],
  joinedDate: '2024-01-15',
};
