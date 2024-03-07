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
    devDefault: 8000,
  }),
  DB_URL: e.str(),
  MIGRATE_DB: e.bool({
    default: false,
    devDefault: false,
    docs: 'Set to true to migrate the database',
    desc: 'Set to true to migrate the database',
  }),
  FRONTEND_URL: e.str({
    devDefault: '*',
  }),
  CLOUDINARY_CLOUD_NAME: e.str(),
  CLOUDINARY_API_KEY: e.str(),
  CLOUDINARY_API_SECRET: e.str(),
  SECRET_KEY: e.str(),
  ACCESS_TOKEN_SECRET: e.str(),
  REFRESH_TOKEN_SECRET: e.str(),
  ACCESS_TOKEN_EXPIRY: e.str(),
  REFRESH_TOKEN_EXPIRY: e.str(),
});

export default env;
