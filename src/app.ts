import {createServer} from 'http';
import app from './api'; // index.ts
import { PORT, BASE_URL } from './config';
import logger from './api/utils/logger';
import sendMail from './api/utils/email';

// Spin server
const server = createServer(app);
server.listen(PORT, () => {
  logger.info(`Server listening on ${PORT}`)
  // sendSms('+2347044124767', `server restarted at ${new Date().toUTCString()}`);
  sendMail(
    `server restarted at ${new Date().toUTCString()}`,
    'Questionia server restarted',
    'blesseth.omeiza@gmail.com',
  );
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  // sendSms('+2347044124767', `Uncaught Exception: ${err.message} at ${new Date().toUTCString()}`);
  sendMail(
    `Uncaught Exception: ${err.message} at ${new Date().toUTCString()}`,
    'Questionia shutting down due to uncaught exception',
    'blesseth.omeiza@gmail.com',
  );
  logger.error(err);
  logger.info('Shutting down due to uncaught exception');
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err:any) => {
  // sendSms('+2347044124767', `Unhandled Promise rejection: ${err.message} at ${new Date().toUTCString()}`);
  sendMail(
    `Unhandled Promise rejection: ${err.message} at ${new Date().toUTCString()}`,
    'Questionia shutting down due to unhandled promise rejection',
    'blesseth.omeiza@gmail.com',
  );
  logger.error(err);
  // Close server & exit process
  logger.info('Shutting down the server due to Unhandled Promise rejection');
  server.close(() => process.exit(1));
});
