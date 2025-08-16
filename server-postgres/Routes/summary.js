import express from 'express';
import pool from '../db.js';

const router = express.Router();

// CREATE a new summary
router.post('/', async (req, res) => {
  const { transcript, summary, topics, class_id, teacher_id, heading } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO summary (transcript, summary, topics, class_id, teacher_id, heading, time)
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
       RETURNING *`,
      [transcript, summary, topics, class_id, teacher_id, heading]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('[ERROR] Failed to create summary:', err.message);
    res.status(500).json({ error: 'Failed to create summary' });
  }
});

// UPDATE a summary
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { transcript, summary, topics, class_id, teacher_id, heading } = req.body;
  try {
    const result = await pool.query(
      `UPDATE summary 
       SET transcript = $1, summary = $2, topics = $3, class_id = $4, teacher_id = $5, heading = $6, time = CURRENT_TIMESTAMP
       WHERE id = $7 
       RETURNING *`,
      [transcript, summary, topics, class_id, teacher_id, heading, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Summary not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('[ERROR] Failed to update summary:', err.message);
    res.status(500).json({ error: 'Failed to update summary' });
  }
});

// READ all summaries
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM summary ORDER BY time DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('[ERROR] Failed to fetch summaries:', err.message);
    res.status(500).json({ error: 'Failed to fetch summaries' });
  }
});

// READ a summary by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM summary WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Summary not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('[ERROR] Failed to fetch summary:', err.message);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

// DELETE a summary
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM summary WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Summary not found' });
    }
    res.json({ message: 'Summary deleted successfully' });
  } catch (err) {
    console.error('[ERROR] Failed to delete summary:', err.message);
    res.status(500).json({ error: 'Failed to delete summary' });
  }
});

export default router;
