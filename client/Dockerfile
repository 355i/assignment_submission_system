# 使用 Node.js 官方镜像
FROM node:20

# 设置工作目录
WORKDIR /app

# 优先复制 package.json 和 package-lock.json 以提高缓存利用
COPY package*.json ./

# 安装依赖（适用于 dev 模式）
RUN npm install

# 复制项目其他文件（避免无关更改触发依赖重装）
COPY . .

# 开放 Vite 默认端口
EXPOSE 5173

# 启动开发服务器
CMD ["npm", "run", "dev"]
