import dotenv from 'dotenv';
import * as e from 'envalid';

dotenv.config();

const env = e.cleanEnv(process.env, {
  NODE_ENV: e.str({
    choices: ['development', 'test', 'production', 'staging'],
    default: 'development',
  }),
  PORT: e.num({
    default: 8000,
  }),
  HOST: e.str({
    devDefault: 'localhost',
  }),
  PROD_DB_URL: e.str({
    default: 'mysql://root:password@localhost:3306/db',
  }),
  DEV_DB_URL: e.str({
    default: 'mysql://root:password@localhost:3306/db',
  }),
  MIGRATE_DB: e.bool({
    default: false,
    docs: 'Set to true to migrate the database',
    desc: 'Set to true to migrate the database',
  }),
  CLIENT_URL: e.str({
    devDefault: '*',
  }),
  CLOUDINARY_CLOUD_NAME: e.str(),
  CLOUDINARY_API_KEY: e.str(),
  CLOUDINARY_API_SECRET: e.str(),
  ACCESS_TOKEN_SECRET: e.str(),
  REFRESH_TOKEN_SECRET: e.str(),
  ACCESS_TOKEN_EXPIRY: e.str(),
  REFRESH_TOKEN_EXPIRY: e.str(),
  VERIFICATION_TOKEN_SECRET: e.str(),
  VERIFICATION_TOKEN_EXPIRY: e.str(),
  SECURITY_TOKEN_SECRET: e.str(),
  SECURITY_TOKEN_EXPIRY: e.str(),
  RESEND_API_KEY: e.str(),
  EMAIL_FROM: e.str(),
  APP_VERSION: e.str({
    default: '1.0.0',
  }),
  GOOGLE_OAUTH_CLIENT_ID: e.str(),
  GOOGLE_OAUTH_CLIENT_SECRET: e.str(),
  COOKIE_EXPIRES_IN: e.num({
    default: 30, // days
  }),
  TWILIO_ACCOUNT_SID: e.str(),
  TWILIO_AUTH_TOKEN: e.str(),
  TWILIO_SERVICE_SID: e.str(),
  TWILIO_PHONE_NUMBER: e.str(),
});

export default env;
