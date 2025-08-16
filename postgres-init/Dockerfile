# 使用官方 PostgreSQL 镜像作为基础镜像
FROM postgres:15

# 设置环境变量（可根据需要修改）
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=root
ENV POSTGRES_DB=vta

# 如果你有数据库初始化 SQL 脚本，复制进去
# 这些脚本会在容器第一次启动时自动运行
COPY ./init.sql /docker-entrypoint-initdb.d/
