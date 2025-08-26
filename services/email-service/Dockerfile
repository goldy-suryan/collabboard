FROM node:current-alpine3.22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY ./.env ./

EXPOSE 3003

CMD [ "node", "server.js" ]