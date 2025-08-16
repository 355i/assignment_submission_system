// routes/teacher.js
import express from 'express';
import pool from '../db.js';

const router = express.Router();

// CREATE a new teacher
router.post('/', async (req, res) => {
  const { name, email, password, dept } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO teacher (name, email, password, dept) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, password, dept]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to create teacher' });
  }
});

// READ all teachers
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM teacher');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch teachers' });
  }
});

// READ a teacher by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM teacher WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch teacher' });
  }
});

// UPDATE a teacher
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, password, dept } = req.body;
  try {
    const result = await pool.query(
      'UPDATE teacher SET name = $1, email = $2, password = $3, dept = $4 WHERE id = $5 RETURNING *',
      [name, email, password, dept, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to update teacher' });
  }
});

// DELETE a teacher
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM teacher WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    res.json({ message: 'Teacher deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to delete teacher' });
  }
});

export default router;
