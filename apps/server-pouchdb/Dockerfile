FROM node:24

WORKDIR /usr/src/app/server-pouchdb

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]