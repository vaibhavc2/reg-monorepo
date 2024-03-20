import { sql } from 'drizzle-orm';
import {
  index,
  int,
  mysqlEnum,
  mysqlTable,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import ct from '../../constants';
import { users } from './users.schema';

export const userCredentials = mysqlTable(
  'user_credentials',
  {
    id: int('id').primaryKey().autoincrement().notNull(),
    user: int('user')
      .references(() => users.id)
      .notNull()
      .unique(),
    email: varchar('email', { length: 256 }).notNull().unique(),
    authType: mysqlEnum('auth_type', ct.authType).default('google').notNull(),
    phone: varchar('phone', { length: 20 }).notNull().unique(), // use e164 format
    password: varchar('password', { length: 256 }),
    createdAt: timestamp('created_at', { mode: 'date', fsp: 6 })
      .default(sql`CURRENT_TIMESTAMP(6)`)
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date', fsp: 6 })
      .default(sql`CURRENT_TIMESTAMP(6) on update CURRENT_TIMESTAMP(6)`)
      .notNull(),
  },
  (userCredentials) => ({
    emailIdx: index('email_idx').on(userCredentials.email),
    phoneIdx: index('phone_idx').on(userCredentials.phone),
  }),
);

export type IUserCredential = typeof userCredentials;
