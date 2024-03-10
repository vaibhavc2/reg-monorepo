import type { Config } from 'drizzle-kit';

export default {
  schema: './libs/db/schema/*',
  out: './drizzle',
  driver: 'mysql2',
  dbCredentials: {
    host: 'localhost',
    user: 'vaibhav',
    password: 'vaibhav',
    database: 'reg-db',
  },
} satisfies Config;
