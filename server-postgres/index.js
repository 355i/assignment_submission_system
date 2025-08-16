import express from 'express'; 
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config.js';
import pool from './db.js';
import assignmentRouter from './Routes/assignment.js';
import summaryRouter from './Routes/summary.js';
import studentRouter from './Routes/student.js';
import teacherRouter from './Routes/teacher.js';
import authRouter from './Routes/auth.js';
import userRouter from './Routes/user.js'; // 新增用户路由
import { retry } from './utils/retry.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// 增加请求体大小限制，支持base64图片上传
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(cookieParser());


app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});


// 路由
app.use('/auth', authRouter);
app.use('/api/users', userRouter); // 新增用户API路由
app.use('/assignment', assignmentRouter);
app.use('/summary', summaryRouter);
app.use('/student', studentRouter);
app.use('/teacher', teacherRouter);

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: 'vta'
  });
});

const port = process.env.PORT || 1000;

const startServer = async () => {
  try {
    await retry(async () => {
      const res = await pool.query('SELECT NOW()');
      console.log('Database connected at:', res.rows[0].now);
    }, 10, 2000);

    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
      console.log(`Health check: http://localhost:${port}/health`);
    });
  } catch (err) {
    console.error('Database connection failed after retries:', err);
    process.exit(1);
  }
}

startServer();