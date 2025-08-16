import express from 'express';
import pool from '../db.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || '9900project';

// JWT验证中间件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// 获取用户详细信息
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id;
    
    // 验证用户是否有权限访问这个用户信息（只能访问自己的信息）
    if (req.user.id !== parseInt(userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await pool.query(
      'SELECT id, name, email, role, avatar, signature, created_at, updated_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    res.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 更新用户信息
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, signature, avatar } = req.body;

    // 验证用户是否有权限更新这个用户信息
    if (req.user.id !== parseInt(userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // 验证输入
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Name is required' });
    }

    // 验证签名长度
    if (signature && signature.length > 200) {
      return res.status(400).json({ error: 'Signature must be less than 200 characters' });
    }

    // 更新用户信息
    const result = await pool.query(
      `UPDATE users 
       SET name = $1, signature = $2, avatar = $3, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $4 
       RETURNING id, name, email, role, avatar, signature, updated_at`,
      [name.trim(), signature || null, avatar || null, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedUser = result.rows[0];
    
    // 生成新的JWT token（包含更新后的信息）
    const newToken = jwt.sign(
      {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      message: 'User updated successfully',
      user: updatedUser,
      token: newToken // 返回新token以便前端更新
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 获取当前用户信息（基于token）
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, avatar, signature, created_at, updated_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;