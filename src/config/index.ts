import path from 'path';

require('dotenv').config();
// use the port query to configure the platform dependent env configs
// lastly set the port
export const PORT = process.env.NODE_ENV === "production" ? process.env.PORT ? process.env.PORT : 443 : 5002;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const DB_NAME = process.env.DB_NAME || 'questioniar';
export const DATABASE_URL = process.env.DATABASE_URL
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
export const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "blesseth.omeiza@gmail.com"
export const TELEGRAM_BOT_TOKEN =process.env.NODE_ENV === "production" ? process.env.TELEGRAM_BOT_TOKEN : process.env.TELEGRAM_DEV_BOT_TOKEN;
export const NEXT_APP_ID = process.env.NEXT_APP_ID;
export const PC = process.env.PC; // this will be defined in the env file in local development