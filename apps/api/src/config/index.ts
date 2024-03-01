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
  DB_URL: e.str(),
  MIGRATE_DB: e.bool({
    default: false,
    devDefault: false,
    docs: 'Set to true to migrate the database',
  }),
});

export default env;
