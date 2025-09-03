FROM node:24

WORKDIR /usr/src/app/web

COPY . .

RUN npm install

# 开发环境使用
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]