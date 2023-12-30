import path from 'path';

require('dotenv').config();
// use the port query to configure the platform dependent env configs
// lastly set the port
export const PORT = process.env.PORT ? process.env.PORT : 5002;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const DB_NAME = process.env.DB_NAME || 'questionia';
export const DATABASE_URL = process.env.PORT
  //@ts-ignore
  ? encodeURI(process.env.DATABASE_URL) : 'mongodb://127.0.0.1:27017';
export const BASE_URL = process.env.PORT ? process.env.BASE_URL : `http://localhost:${PORT}/`;
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
  || 'iaowuebpiqupiwr8qb4pq39yrvwyveiwqpbrpiqy8y34yq377v5q45yy5';

export const GOOGLE_CONFIG_REDIRECT_URI = process.env.PORT
  ? process.env.GOOGLE_CONFIG_REDIRECT_URI : 'http://localhost:5000/auth/google/callback';

export const BASE_DIR = path.join(__dirname, '..', '..');
export const PUBLIC_DIR = path.join(BASE_DIR, 'public');
export const UPLOAD_DIR = path.join(PUBLIC_DIR, 'static', 'uploads');
export const FRONTEND_URL = `${process.env.BASE_URL}/app`;
export const FRONT_END_PATH = path.join(BASE_DIR, 'public', 'app');
export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
export const SENDGRID_EMAIL_FROM = process.env.SENDGRID_EMAIL_FROM;
export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
export const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
