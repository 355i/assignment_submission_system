#!/usr/bin/env node

/**
 * 数据库迁移脚本
 * 用于为现有开发者更新数据库结构
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const CONTAINER_NAME = 'capstone-project-25t2-9900-w18c-bread-db-1';
const MIGRATION_FILE = 'postgres-init/migrate_to_v2.sql';

console.log('🚀 开始数据库迁移...\n');

try {
  // 1. 检查容器是否运行
  console.log('1️⃣ 检查数据库容器状态...');
  try {
    execSync(`docker ps --filter name=${CONTAINER_NAME} --format "table {{.Names}}\t{{.Status}}"`, { stdio: 'pipe' });
    console.log('✅ 数据库容器正在运行\n');
  } catch (error) {
    console.error('❌ 数据库容器未运行，请先启动：npm run docker');
    process.exit(1);
  }

  // 2. 检查迁移文件是否存在
  console.log('2️⃣ 检查迁移文件...');
  if (!fs.existsSync(MIGRATION_FILE)) {
    console.error(`❌ 迁移文件不存在: ${MIGRATION_FILE}`);
    process.exit(1);
  }
  console.log('✅ 迁移文件存在\n');

  // 3. 复制迁移文件到容器
  console.log('3️⃣ 复制迁移文件到数据库容器...');
  execSync(`docker cp ${MIGRATION_FILE} ${CONTAINER_NAME}:/tmp/migrate_to_v2.sql`);
  console.log('✅ 文件复制成功\n');

  // 4. 执行迁移
  console.log('4️⃣ 执行数据库迁移...');
  const migrationOutput = execSync(
    `docker exec -it ${CONTAINER_NAME} psql -U postgres -d vta -f /tmp/migrate_to_v2.sql`,
    { encoding: 'utf8' }
  );
  console.log('✅ 迁移执行完成');
  console.log('📋 迁移输出:');
  console.log(migrationOutput);

  // 5. 验证迁移结果
  console.log('5️⃣ 验证迁移结果...');
  const verifyOutput = execSync(
    `docker exec -it ${CONTAINER_NAME} psql -U postgres -d vta -c "\\d users"`,
    { encoding: 'utf8' }
  );
  
  if (verifyOutput.includes('avatar') && verifyOutput.includes('signature') && verifyOutput.includes('updated_at')) {
    console.log('✅ 迁移验证成功！新字段已添加到 users 表');
    console.log('\n🎉 数据库迁移完成！现在可以使用新的用户账户功能了。');
  } else {
    console.log('⚠️  迁移可能不完整，请检查数据库结构');
    console.log('📋 当前 users 表结构:');
    console.log(verifyOutput);
  }

  // 6. 清理临时文件
  console.log('\n6️⃣ 清理临时文件...');
  execSync(`docker exec ${CONTAINER_NAME} rm -f /tmp/migrate_to_v2.sql`);
  console.log('✅ 清理完成');

} catch (error) {
  console.error('\n❌ 迁移过程中发生错误:');
  console.error(error.message);
  console.error('\n📋 故障排除建议:');
  console.error('1. 确保 Docker 容器正在运行: npm run docker');
  console.error('2. 确保有足够的权限执行 Docker 命令');
  console.error('3. 如果仍有问题，尝试手动迁移或重置数据库: npm run reset-db');
  process.exit(1);
}