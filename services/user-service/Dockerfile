FROM node:current-alpine3.22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY ./.env ./

EXPOSE 3002

CMD [ "node", "server.js" ]