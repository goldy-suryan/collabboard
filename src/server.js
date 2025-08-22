const express = require('express');
const dotenv = require('dotenv');
const logger = require('morgan');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');
const { init } = require('./socket');
dotenv.config();

const connectDB = require('./config/db');
const taskRoute = require('./routes/taskRoute');
const errorMiddleware = require('./middlewares/errorMiddleware');

const port = process.env.PORT || 8000;
const loggingFile = fs.createWriteStream(path.join(__dirname, 'access.log'));
const app = express();

// Connection to Database
connectDB();

const server = http.createServer(app);
const io = init(server);

//Middlewares
app.use(express.json());
app.use(logger('combined', { stream: loggingFile }));
app.use(cors());

//Routes
app.use('/task', taskRoute);

// Error Handler
app.use(errorMiddleware.notFound);
app.use(errorMiddleware.unknownError);

const pubClient = createClient({ url: 'redis://127.0.0.1:6379' });
const subClient = pubClient.duplicate();

Promise.all([pubClient.connect(), subClient.connect()])
  .then(() => {
    io.adapter(createAdapter(pubClient, subClient));
    console.log('adapter connected with socket');

    io.on('connection', (socket) => {
      console.log(`connected ${socket.id}`);

      socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
      });

      socket.on('task:created', (data) => {
        let roomId = socket.data.roomId;
        console.log(data, 'data here when task is created');
        io.to(roomId).emit('task:created', data);
      });

      socket.on('task:updated', (data) => {
        let roomId = socket.data.roomId;
        console.log(data, 'data here when task is updated');
        io.to(roomId).emit('task:updated', data);
      });

      socket.on('task:deleted', (data) => {
        let roomId = socket.data.roomId;
        console.log(data, 'data here when task is deleted');
        io.to(roomId).emit('task:deleted', data);
      });

      socket.on('disconnect', () => {
        console.log(`disconnected ${socket.id}`);
      });
    });
  })
  .catch((e) => {
    console.log(e, 'error');
  });

//Server
server.listen(port, '0.0.0.0', (err) => {
  if (err) console.error(`Error while starting server: ${err}`);
  console.log(`Server started on port: ${port}`);
});
