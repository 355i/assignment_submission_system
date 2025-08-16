import express from 'express';
import pool from '../db.js'; // 你的 pg pool 实例
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// JWT密钥，优先使用环境变量，未配置时使用默认值（仅开发环境用）
const JWT_SECRET = process.env.JWT_SECRET || '9900project';

// 注册接口
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  // 简单参数校验
  if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string' || typeof role !== 'string') {
    return res.status(400).json({ error: 'Invalid input types' });
  }

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (!['student', 'teacher'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  try {
    // 检查用户是否存在
    const userExist = await pool.query('SELECT 1 FROM users WHERE email = $1', [email]);
    if (userExist.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // 哈希密码
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 插入用户
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role`,
      [name, email, hashedPassword, role]
    );

    res.status(201).json({ message: 'User registered successfully', user: result.rows[0] });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// 登录接口
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Invalid input types' });
  }
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  try {
    const userRes = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userRes.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = userRes.rows[0];

    // 校验密码
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // 生成 JWT
    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    // 如果后续想用 httpOnly cookie 存token，示例写法：
    // res.cookie('token', token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   maxAge: 8 * 3600 * 1000 // 8小时
    // });

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

export default router;
