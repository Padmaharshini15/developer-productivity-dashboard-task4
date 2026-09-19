const db = require('../config/db');

exports.getAllTasks = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM tasks');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getTaskById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createTask = async (req, res) => {
  const { title, status, project_id, assignee_id } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    // Check project exists
    if (project_id) {
        const projectCheck = await db.query('SELECT id FROM projects WHERE id = $1', [project_id]);
        if (projectCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }
    }

    // Check user exists
    if (assignee_id) {
        const userCheck = await db.query('SELECT id FROM users WHERE id = $1', [assignee_id]);
        if (userCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Assignee not found' });
        }
    }

    const result = await db.query(
      'INSERT INTO tasks (title, status, project_id, assignee_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, status || 'TODO', project_id || null, assignee_id || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, status, project_id, assignee_id } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
     // Check project exists
     if (project_id) {
        const projectCheck = await db.query('SELECT id FROM projects WHERE id = $1', [project_id]);
        if (projectCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }
    }

    // Check user exists
    if (assignee_id) {
        const userCheck = await db.query('SELECT id FROM users WHERE id = $1', [assignee_id]);
        if (userCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Assignee not found' });
        }
    }

    const result = await db.query(
      'UPDATE tasks SET title = $1, status = $2, project_id = $3, assignee_id = $4 WHERE id = $5 RETURNING *',
      [title, status || 'TODO', project_id || null, assignee_id || null, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateTaskStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  try {
    const result = await db.query(
      'UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
