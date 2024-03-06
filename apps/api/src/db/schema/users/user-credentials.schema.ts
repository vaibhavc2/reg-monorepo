import { sql } from 'drizzle-orm';
import {
  index,
  int,
  mysqlEnum,
  mysqlTable,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
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
    authProvider: mysqlEnum('auth_provider', ['google', 'apple', 'email'])
      .default('email')
      .notNull(),
    phone: varchar('phone', { length: 20 }).notNull().unique(), // use e164 format
    salt: varchar('salt', { length: 256 }).notNull(),
    password: varchar('password', { length: 256 }).unique(),
    // TODO: make sure that the password is hashed and salted automatically using triggers and event scheduler, similar to 'pre' and 'post' hooks in mongoose
    createdAt: timestamp('created_at')
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: timestamp('updated_at')
      .default(sql`CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (userCredentials) => ({
    emailIdx: index('email_idx').on(userCredentials.email),
    phoneIdx: index('phone_idx').on(userCredentials.phone),
  }),
);
