import express from 'express';
import pool from '../db.js';
import { authenticate, requireRole } from '../middleware/authMiddleware.js';
import smartUpload from '../middleware/uploadMiddleware.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";


import { checkUserAssignmentAccess } from '../utils/assignmentAccess.js';
import cleanupFiles from '../utils/cleanFiles.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();


// CREATE a full assignment set with details
router.post(
  '/',
  authenticate,
  requireRole('teacher'),
  smartUpload.fields([
    { name: 'faq', maxCount: 1 },
    { name: 'detail', maxCount: 1 }
  ]),
  async (req, res) => {
    const {
      title,
      course_name,
      year,
      semester,
      description,
      marking_rubric,
      release_date,
      due_date
    } = req.body;

    const created_by = req.user.id;

    const faqFile = req.files['faq']?.[0];
    const detailFile = req.files['detail']?.[0];


    if (!title || !course_name || !year || !semester || !description) {
      cleanupFiles(req);
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    try {
      // 查找课程 ID
      const courseResult = await pool.query(
        `SELECT id FROM courses WHERE name = $1 AND year = $2 AND semester = $3`,
        [course_name, year, semester]
      );

      if (courseResult.rows.length === 0) {
        cleanupFiles(req);
        return res.status(404).json({ error: 'Course not found.' });
      }

      const course_id = courseResult.rows[0].id;

      // 插入 assignment_set
      const result = await pool.query(
        `INSERT INTO assignment_set (
          title, course_id, created_by, description, marking_rubric,
          release_date, due_date, time, faq_file_path, detail_file_path
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, $8, $9
        ) RETURNING *`,
        [
          title,
          course_id,
          created_by,
          JSON.stringify({ content: description }),
          marking_rubric,
          release_date,
          due_date,
          faqFile?.path || null,
          detailFile?.path || null
        ]
      );

      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Error creating assignment set:', err);
      cleanupFiles(req);
      res.status(500).json({ error: 'Failed to create assignment set' });
    }
  }
);


// READ all assignment sets
router.get('/', authenticate, async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;

  try {
    let query = '';
    let params = [userId];

    if (role === 'student') {
      query = `
        SELECT a.*, c.name as course_name
        FROM assignment_set a
        JOIN courses c ON a.course_id = c.id
        JOIN course_student cs ON a.course_id = cs.course_id
        WHERE cs.student_id = $1
        ORDER BY a.time DESC
      `;
    } else if (role === 'teacher') {
      query = `
        SELECT a.*, c.name as course_name
        FROM assignment_set a
        JOIN courses c ON a.course_id = c.id
        JOIN course_teacher ct ON a.course_id = ct.course_id
        WHERE ct.teacher_id = $1
        ORDER BY a.time DESC
      `;
    } else {
      return res.status(403).json({ error: 'Unauthorized role' });
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Failed to fetch assignments:', err);
    res.status(500).json({ error: 'Failed to fetch assignment sets', details: err.message });
  }
});



// READ a specific assignment set by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const assignmentId = parseInt(req.params.id, 10);
    const assignment = await checkUserAssignmentAccess(pool, assignmentId, req.user, ['*']);

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment set not found or not accessible' });
    }

    // 判断教师是否有编辑权限，学生无权限
    const canEdit = req.user.role === 'teacher';

    // 判断 detail 文件是否存在且路径有效
    let hasDetail = false;
    if (assignment.detail_file_path && assignment.detail_file_path.trim() !== '') {
      const absPath = path.resolve(__dirname, '../', assignment.detail_file_path);
      hasDetail = fs.existsSync(absPath);
    }
    // console.log('assignment:', assignment);
    // console.log('typeof assignment:', typeof assignment);
    // console.log('Object.keys(assignment):', Object.keys(assignment));

    res.json({
      ...assignment,
      can_edit: canEdit,
      has_detail: hasDetail,
    });
  } catch (err) {
    console.error('Failed to fetch assignment set:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to fetch assignment set', details: err.message });
    }
  }
});


// use for downloading the detail file
router.get('/:id/download', authenticate, async (req, res) => {
  try {
    const assignmentId = parseInt(req.params.id, 10);
    const fileType = req.query.file; // only supports 'detail'

    if (!['detail'].includes(fileType)) {
      return res.status(400).json({ error: 'Invalid file type requested. Use "detail".' });
    }

    const assignment = await checkUserAssignmentAccess(pool, assignmentId, req.user, ['*']);
    // console.log('assignment:', assignment);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found or access denied' });
    }

    const filePath = assignment.detail_file_path;
    // console.log('File path:', filePath);
    if (!filePath || filePath.trim() === '') {
      return res.status(404).json({ error: `${fileType.toUpperCase()} file not found for this assignment` });
    }

    const absolutePath = path.resolve(__dirname, '../', filePath);

    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ error: 'File not found on server' });
    }

    res.download(absolutePath, (err) => {
      if (err) {
        console.error('File download error:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Failed to download file' });
        }
      }
    });
  } catch (error) {
    console.error('Download API error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});


// UPDATE an assignment set
router.put(
  '/:id',
  authenticate,
  requireRole('teacher'),
  smartUpload.fields([
    { name: 'faq', maxCount: 1 },
    { name: 'detail', maxCount: 1 }
  ]),
  async (req, res) => {
    const { id } = req.params;
    const {
      title,
      description,
      marking_rubric,
      release_date,
      due_date,
    } = req.body;
    const userId = req.user.id;

    const faqFile = req.files['faq']?.[0];
    const detailFile = req.files['detail']?.[0];

    try {
      // 权限校验
      const checkQuery = `
        SELECT faq_file_path, detail_file_path
        FROM assignment_set a
        JOIN course_teacher ct ON a.course_id = ct.course_id
        WHERE a.id = $1 AND ct.teacher_id = $2
      `;
      const checkResult = await pool.query(checkQuery, [id, userId]);

      if (checkResult.rows.length === 0) {
        cleanupFiles(req);
        return res.status(403).json({ error: 'You are not authorized to update this assignment' });
      }

      const oldRecord = checkResult.rows[0];
      console.log('Old record:', oldRecord);

      // 删除旧文件（如果上传了新文件）
      if (faqFile && oldRecord.faq_file_path) {
        const absoluteFaqPath = path.resolve(__dirname, '../', oldRecord.faq_file_path);
        if (fs.existsSync(absoluteFaqPath)) {
          fs.unlinkSync(absoluteFaqPath);
          console.log('Deleted old faq file:', absoluteFaqPath);
        }
      }

      if (detailFile && oldRecord.detail_file_path) {
        const absoluteDetailPath = path.resolve(__dirname, '../', oldRecord.detail_file_path);
        console.log('Absolute detail path:', absoluteDetailPath);
        if (fs.existsSync(absoluteDetailPath)) {
          fs.unlinkSync(absoluteDetailPath);
          console.log('Deleted old detail file:', absoluteDetailPath);
        }
      }

      const updateQuery = `
        UPDATE assignment_set SET
          title = COALESCE($1, title),
          description = COALESCE($2, description),
          marking_rubric = COALESCE($3, marking_rubric),
          release_date = COALESCE($4, release_date),
          due_date = COALESCE($5, due_date),
          faq_file_path = COALESCE($6, faq_file_path),
          detail_file_path = COALESCE($7, detail_file_path),
          time = CURRENT_TIMESTAMP
        WHERE id = $8
        RETURNING *
      `;

      const updateResult = await pool.query(updateQuery, [
        title || null,
        description ? JSON.stringify({ content: description }) : null,
        marking_rubric || null,
        release_date || null,
        due_date || null,
        faqFile?.path || null,
        detailFile?.path || null,
        id
      ]);

      if (updateResult.rows.length === 0) {
        cleanupFiles(req);
        return res.status(404).json({ error: 'Assignment set not found' });
      }

      res.json(updateResult.rows[0]);
    } catch (err) {
      console.error('Failed to update assignment set:', err);
      cleanupFiles(req);
      res.status(500).json({ error: 'Failed to update assignment set', details: err.message });
    }
  }
);



// DELETE an assignment set
router.delete('/:id', authenticate, requireRole('teacher'), async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    // 先确认该老师是该作业课程的老师
    const checkQuery = `
      SELECT a.id
      FROM assignment_set a
      JOIN course_teacher ct ON a.course_id = ct.course_id
      WHERE a.id = $1 AND ct.teacher_id = $2
    `;
    const checkResult = await pool.query(checkQuery, [id, userId]);

    if (checkResult.rows.length === 0) {
      return res.status(403).json({ error: 'You are not authorized to delete this assignment' });
    }

    // 删除作业
    const deleteResult = await pool.query(
      'DELETE FROM assignment_set WHERE id = $1 RETURNING *',
      [id]
    );

    if (deleteResult.rows.length === 0) {
      return res.status(404).json({ error: 'Assignment set not found' });
    }

    res.json({ message: 'Assignment set deleted successfully' });
  } catch (err) {
    console.error('Failed to delete assignment set:', err);
    res.status(500).json({ error: 'Failed to delete assignment set', details: err.message });
  }
});


//student only route 
router.post(
  '/',
  authenticate,
  requireRole('student'),
  smartUpload.single('submission'),
  async (req, res) => {
    const { assignment_id } = req.body;
    const student_id = req.user.id;
    const file = req.file;

    if (!assignment_id || !file) {
      return res.status(400).json({ error: 'Missing assignment_id or submission file' });
    }

    try {
      // 1. 检查 assignment 是否存在
      const assignmentResult = await pool.query(
        `SELECT * FROM assignment_set WHERE id = $1`,
        [assignment_id]
      );

      if (assignmentResult.rows.length === 0) {
        fs.unlinkSync(file.path);
        return res.status(404).json({ error: 'Assignment not found' });
      }

      // 2. 检查是否已有提交
      const existing = await pool.query(
        `SELECT * FROM assignment_student WHERE assignment_id = $1 AND student_id = $2`,
        [assignment_id, student_id]
      );

      if (existing.rows.length > 0) {
        // 2.1 删除旧文件
        const oldPath = existing.rows[0].submission_file_path;
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }

        // 2.2 更新记录为新文件路径和新时间
        const updateResult = await pool.query(
          `UPDATE assignment_student
           SET assigned_at = CURRENT_TIMESTAMP,
               submission_file_path = $3
           WHERE assignment_id = $1 AND student_id = $2
           RETURNING *`,
          [assignment_id, student_id, file.path]
        );

        return res.status(200).json({
          message: 'Submission updated successfully',
          submission: updateResult.rows[0]
        });
      }

      // 3. 否则，新建提交记录
      const result = await pool.query(
        `INSERT INTO assignment_student (
          assignment_id, student_id, assigned_at, submission_file_path
        ) VALUES ($1, $2, CURRENT_TIMESTAMP, $3)
        RETURNING *`,
        [assignment_id, student_id, file.path]
      );

      res.status(201).json({
        message: 'Submission successful',
        submission: result.rows[0]
      });
    } catch (err) {
      console.error('Error submitting assignment:', err);
      fs.unlinkSync(file.path);
      res.status(500).json({ error: 'Failed to submit assignment' });
    }
  }
);
export default router;
