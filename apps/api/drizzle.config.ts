import type { Config } from 'drizzle-kit';
import env from './src/config';

export default {
  schema: './src/db/schema/*',
  out: './drizzle',
  driver: 'mysql2',
  dbCredentials: {
    uri: env.DB_URL,
  },
} satisfies Config;
