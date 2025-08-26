FROM node:current-alpine3.22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY ./.env ./

EXPOSE 8000

CMD ["node", "server.js"]