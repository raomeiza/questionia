import { createServer } from 'http';
import { createServer as createHttpsServer } from 'https';
import app from './api'; // index.ts
import { PORT, BASE_URL, NODE_ENV, ADMIN_EMAIL } from './config';
import logger from './api/utils/logger';
import sendMail from './api/utils/email';
import fs from 'fs';
import path from 'path';
import { Server as SocketIOServer } from 'socket.io';

const options = {
  key: fs.readFileSync(path.resolve(__dirname, '../cert/privkey.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, '../cert/fullchain.pem')),
};

// Spin server
const server = NODE_ENV === 'production' ? createHttpsServer(options, app).listen(PORT, async () => {
  // Create an HTTP server that redirects to the HTTPS server
  createServer((req: any, res: any) => {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
  }).listen(80, () => {
    sendMail('The redirect server is running', 'Redirect Server', ADMIN_EMAIL); // send email to the admin
  });

  console.info(`Server listening on ${BASE_URL}`);
}) : createServer(app).listen(PORT, () => {
  console.info(`Server listening on ${BASE_URL}`);
});

const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.emit("me", socket.id);

  socket.on('signal', (data) => {
    const { signal, to } = data;
    io.to(to).emit('signal', { signal, from: socket.id });
  });

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit('callUser', { signal: data.signalData, from: data.from, name: data.name });
  });

  socket.on("callAccepted", (data) => {
    io.to(data.to).emit('callAccepted', data.signal);
  });

  socket.on('callEnded', (data) => {
    io.to(data.to).emit('callEnded', data);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    socket.broadcast.emit('callEnded', { id: socket.id });
  });
});


// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  sendMail(
    `Uncaught Exception: ${err.message} at ${new Date().toUTCString()}`,
    'Questioniar shutting down due to uncaught exception',
    ADMIN_EMAIL,
  );
  logger.error(err);
  logger.info('Shutting down due to uncaught exception');
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: any) => {
  sendMail(
    `Unhandled Promise rejection: ${err.message} at ${new Date().toUTCString()}`,
    'Questioniar shutting down due to unhandled promise rejection',
    ADMIN_EMAIL,
  );
  logger.error(err);
  // Close server & exit process
  logger.info('Shutting down the server due to Unhandled Promise rejection');
  server.close(() => process.exit(1));
});
