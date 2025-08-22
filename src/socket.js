const { Server } = require('socket.io');
let io;

module.exports = {
  init: (server) => {
    io = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket is not initialized');
    }
    return io;
  },
};
