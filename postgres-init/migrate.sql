-- 数据库迁移脚本
-- 为现有开发者添加用户账户功能所需的字段

-- 添加新字段到 users 表
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS avatar TEXT,
ADD COLUMN IF NOT EXISTS signature TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 删除旧触发器（如果存在）
DROP TRIGGER IF EXISTS update_users_updated_at ON users;

-- 创建新触发器
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 为现有用户设置 updated_at 值
UPDATE users 
SET updated_at = created_at 
WHERE updated_at IS NULL;

-- 为现有用户添加示例签名（可选）
UPDATE users 
SET signature = CASE 
    WHEN role = 'teacher' THEN 'Passionate educator ready to help students succeed!'
    WHEN role = 'student' THEN 'Eager to learn and grow in my academic journey!'
    ELSE 'Hello everyone!'
END
WHERE signature IS NULL OR signature = '';

-- 验证迁移结果
DO $$
DECLARE
    column_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO column_count
    FROM information_schema.columns 
    WHERE table_name = 'users' 
    AND column_name IN ('avatar', 'signature', 'updated_at');
    
    IF column_count = 3 THEN
        RAISE NOTICE '✅ 迁移成功完成！添加了 avatar, signature, updated_at 字段';
    ELSE
        RAISE NOTICE '❌ 迁移可能不完整，请检查字段';
    END IF;
END $$;