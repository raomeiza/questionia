import {createServer} from 'http';
import {createServer as createHttpsServer} from 'https';
import app from './api'; // index.ts
import { PORT, BASE_URL, NODE_ENV, ADMIN_EMAIL } from './config';
import logger from './api/utils/logger';
import sendMail from './api/utils/email';
import fs from 'fs';
import path from 'path';

const options = {
  key: fs.readFileSync(path.resolve(__dirname, '../cert/privkey.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, '../cert/fullchain.pem')),
};
// Spin server
const server = NODE_ENV === 'production' ? createHttpsServer(options, app).listen(PORT, async () => {
  // in here, lets create a http server that will be redirecting to the https server
  // this is to ensure that the server is accessible on all platforms
  createServer((req: any, res: any) => {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
  }).listen(80, () => {
    sendMail('The redirect server is running', 'Redirect Server', ADMIN_EMAIL); // send email to the admin
  });

  console.info(`Server listening on ${BASE_URL}`)
}) : app.listen(PORT, async () => {
  console.info(`Server listening on ${BASE_URL}`)

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
