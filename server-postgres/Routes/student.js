// routes/student.js
import express from 'express';
import pool from '../db.js';

const router = express.Router();

// CREATE a new student
router.post('/', async (req, res) => {
  const { name, class: studentClass, email, password } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO student (name, class, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, studentClass, email, password]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to create student' });
  }
});

// READ all students
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM student');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// READ a student by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM student WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch student' });
  }
});

// UPDATE a student
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, class: studentClass, email, password } = req.body;
  try {
    const result = await pool.query(
      'UPDATE student SET name = $1, class = $2, email = $3, password = $4 WHERE id = $5 RETURNING *',
      [name, studentClass, email, password, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to update student' });
  }
});

// DELETE a student
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM student WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

export default router;
