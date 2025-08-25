const express = require('express');
const cors = require('cors');
const http = require('http');
const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');
const { Kafka } = require('kafkajs');
const { init } = require('./socket');

const port = 3001;

const app = express();

app.use(cors());

const server = http.createServer(app);
const io = init(server);

const kafka = new Kafka({
  clientId: 'notification-service',
  brokers: ['localhost:9094'],
});

const consumer = kafka.consumer({ groupId: 'task-group' });

(async () => {
  try {
    await consumer.connect();
    await Promise.all([
      consumer.subscribe({
        topic: 'task_created',
        fromBeginning: true,
      }),
      consumer.subscribe({
        topic: 'task_updated',
        fromBeginning: true,
      }),
      consumer.subscribe({
        topic: 'task_deleted',
        fromBeginning: true,
      }),
    ]);

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log(topic, partition, message.value.toString());
        io.emit(topic, message.value.toString());
      },
    });
  } catch (e) {
    console.log(e, 'error in notification service');
  }
})();

io.on('connection', (socket) => {
  console.log(`connected ${socket.id}`);

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // let roomId = socket.data.roomId;

  socket.on('disconnect', () => {
    console.log(`disconnected ${socket.id}`);
  });
});

// Not using redis and socket adapter as we are using kafka for message persistence
// const pubClient = createClient({ url: 'redis://127.0.0.1:6379' });
// const subClient = pubClient.duplicate();

// Promise.all([pubClient.connect(), subClient.connect()])
//   .then(() => {
//     io.adapter(createAdapter(pubClient, subClient));
//     console.log('adapter connected with socket');

//   })
//   .catch((e) => {
//     console.log(e, 'error');
//   });

server.listen(port, '0.0.0.0', (err) => {
  if (err) {
    console.log(err, 'Error');
    process.exit(1);
  }
  console.log(`Notification server listening on port: ${port}`);
});
