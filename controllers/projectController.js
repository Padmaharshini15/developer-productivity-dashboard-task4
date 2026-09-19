const db = require('../config/db');

exports.getAllProjects = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM projects');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getProjectById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM projects WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createProject = async (req, res) => {
  const { title, description, user_id } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    if (user_id) {
      const userCheck = await db.query('SELECT id FROM users WHERE id = $1', [user_id]);
      if (userCheck.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
    }

    const result = await db.query(
      'INSERT INTO projects (title, description, user_id) VALUES ($1, $2, $3) RETURNING *',
      [title, description, user_id || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateProject = async (req, res) => {
  const { id } = req.params;
  const { title, description, user_id } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    if (user_id) {
      const userCheck = await db.query('SELECT id FROM users WHERE id = $1', [user_id]);
      if (userCheck.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
    }

    const result = await db.query(
      'UPDATE projects SET title = $1, description = $2, user_id = $3 WHERE id = $4 RETURNING *',
      [title, description, user_id || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM projects WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
