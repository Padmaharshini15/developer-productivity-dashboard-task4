require('dotenv').config();
const express = require('express');

const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(require('cors')({
  origin: ['https://developer-productivity-dashboard-ta.vercel.app', 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Centralized error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
