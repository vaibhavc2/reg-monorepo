import { sql } from 'drizzle-orm';
import {
  boolean,
  index,
  int,
  mysqlTable,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { users } from './users.schema';

export const emailCredentials = mysqlTable(
  'email_credentials',
  {
    id: int('id').primaryKey().autoincrement().notNull(),
    user: int('user')
      .references(() => users.id)
      .notNull()
      .unique(),
    email: varchar('email', { length: 256 }).notNull().unique(),
    googleAuth: boolean('google_auth').default(false).notNull(),
    password: varchar('password', { length: 256 }),
    createdAt: timestamp('created_at', { mode: 'date', fsp: 6 })
      .default(sql`CURRENT_TIMESTAMP(6)`)
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date', fsp: 6 })
      .default(sql`CURRENT_TIMESTAMP(6) on update CURRENT_TIMESTAMP(6)`)
      .notNull(),
  },
  (emailCredentials) => ({
    userIdx: index('user_idx').on(emailCredentials.user),
    emailIdx: index('email_idx').on(emailCredentials.email),
  }),
);

export type IEmailCredential = typeof emailCredentials;
