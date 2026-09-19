export function validateProject(project) {
  const errors = {};

  if (!project.name || !project.name.trim()) {
    errors.name = 'Project name is required';
  } else if (project.name.trim().length < 3) {
    errors.name = 'Project name must be at least 3 characters';
  } else if (project.name.trim().length > 100) {
    errors.name = 'Project name must be less than 100 characters';
  }

  if (!project.description || !project.description.trim()) {
    errors.description = 'Project description is required';
  } else if (project.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters';
  }

  if (!project.status) {
    errors.status = 'Project status is required';
  }

  if (!project.priority) {
    errors.priority = 'Project priority is required';
  }

  if (!project.dueDate) {
    errors.dueDate = 'Due date is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateTask(task) {
  const errors = {};

  if (!task.title || !task.title.trim()) {
    errors.title = 'Task title is required';
  } else if (task.title.trim().length < 3) {
    errors.title = 'Task title must be at least 3 characters';
  } else if (task.title.trim().length > 150) {
    errors.title = 'Task title must be less than 150 characters';
  }

  if (!task.projectId) {
    errors.projectId = 'Please select a project';
  }

  if (!task.status) {
    errors.status = 'Task status is required';
  }

  if (!task.priority) {
    errors.priority = 'Task priority is required';
  }

  if (!task.dueDate) {
    errors.dueDate = 'Due date is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
