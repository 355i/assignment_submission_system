-- 删除旧表（顺序很重要）
DROP TABLE IF EXISTS assignment_student;
DROP TABLE IF EXISTS assignment_set;
DROP TABLE IF EXISTS course_teacher;
DROP TABLE IF EXISTS course_student;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS users;

-- 用户表（包含新增字段）
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher')),
  avatar TEXT,                                      -- 新增字段：用户头像
  signature TEXT,                                   -- 新增字段：用户签名
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP  -- 新增字段：更新时间
);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器自动更新 updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 课程表
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  year INTEGER NOT NULL,
  semester TEXT NOT NULL CHECK (semester IN ('T0', 'T1', 'T2', 'T3'))
);

-- 多对多：课程与教师
CREATE TABLE course_teacher (
  id SERIAL PRIMARY KEY,
  course_id INTEGER NOT NULL,
  teacher_id INTEGER NOT NULL,
  FOREIGN KEY (course_id) REFERENCES courses(id),
  FOREIGN KEY (teacher_id) REFERENCES users(id),
  UNIQUE (course_id, teacher_id)
);

-- 多对多：课程与学生
CREATE TABLE course_student (
  id SERIAL PRIMARY KEY,
  course_id INTEGER NOT NULL,
  student_id INTEGER NOT NULL,
  FOREIGN KEY (course_id) REFERENCES courses(id),
  FOREIGN KEY (student_id) REFERENCES users(id),
  UNIQUE (course_id, student_id)
);

-- 作业表
CREATE TABLE assignment_set (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  course_id INTEGER NOT NULL,
  description JSONB NOT NULL,
  marking_rubric TEXT,
  faq_file_path TEXT,         -- 新增：FAQ 文件路径
  detail_file_path TEXT,      -- 新增：PDF 文件路径
  time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  release_date TIMESTAMP,
  due_date TIMESTAMP,
  created_by INTEGER NOT NULL,
  FOREIGN KEY (course_id) REFERENCES courses(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 作业与学生的分配
CREATE TABLE assignment_student (
  id SERIAL PRIMARY KEY,
  assignment_id INTEGER NOT NULL,
  student_id INTEGER NOT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  submission_file_path TEXT,
  score NUMERIC(5,2),  
  feedback TEXT,        
  graded_at TIMESTAMP,  
  grader_id INTEGER REFERENCES users(id),
  FOREIGN KEY (assignment_id) REFERENCES assignment_set(id),
  FOREIGN KEY (student_id) REFERENCES users(id),
  UNIQUE (assignment_id, student_id)
);

-- 插入用户（包含新字段的默认值）
INSERT INTO users (name, email, password_hash, role, signature) VALUES
('Alice Teacher', 'a@qq.com', '$2b$10$WIrlwaBP91Gm/kKApRt8EO7Nbyi4vIvqgtitcsN17rjgNn7C8zuh2', 'teacher', 'Passionate about teaching and learning!'),
('Bob Teacher', 'b@qq.com', '$2b$10$WIrlwaBP91Gm/kKApRt8EO7Nbyi4vIvqgtitcsN17rjgNn7C8zuh2', 'teacher', 'Making education accessible to everyone.'),
('Carol Student', 'c@qq.com', '$2b$10$WIrlwaBP91Gm/kKApRt8EO7Nbyi4vIvqgtitcsN17rjgNn7C8zuh2', 'student', 'Eager to learn and grow!'),
('Dave Student', 'd@qq.com', '$2b$10$WIrlwaBP91Gm/kKApRt8EO7Nbyi4vIvqgtitcsN17rjgNn7C8zuh2', 'student', 'Love coding and problem solving!');

-- 插入课程
INSERT INTO courses (name, year, semester) VALUES
  ('COMP1111', 2025, 'T2'),
  ('COMP2222', 2025, 'T2');

-- 分配老师到课程
INSERT INTO course_teacher (course_id, teacher_id) VALUES
  (1, 1),  -- Alice
  (2, 2);  -- Bob

-- 分配学生到课程
INSERT INTO course_student (course_id, student_id) VALUES
  (1, 3),  -- Carol
  (2, 4);  -- Dave

-- 添加作业
INSERT INTO assignment_set (title, course_id, description, marking_rubric, created_by)
VALUES
  (
    'Week 1 Assignment for COMP1111',
    1,
    '{"content": "This is a simple assignment description."}'::jsonb,
    'Answer must explain the concept clearly.',
    1
  ),
  (
    'Week 1 Assignment for COMP2222',
    2,
    '{"content": "This is another simple assignment description."}'::jsonb,
    'Answer must explain the concept clearly.',
    2
  );

-- 分配作业给学生
INSERT INTO assignment_student (assignment_id, student_id) VALUES
(1, 3),  -- Carol
(1, 4);  -- Dave