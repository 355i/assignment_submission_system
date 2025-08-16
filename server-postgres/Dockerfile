FROM node:18

WORKDIR /app

COPY package*.json ./

# 添加这行确保 devDependencies 也被安装
ENV NODE_ENV=development

RUN npm install

RUN npm install -g nodemon

COPY . .

COPY tools/wait-for-it.sh /usr/local/bin/wait-for-it.sh
RUN chmod +x /usr/local/bin/wait-for-it.sh

EXPOSE 1000

CMD ["wait-for-it.sh", "db:5432", "--", "npm", "run", "dev"]
