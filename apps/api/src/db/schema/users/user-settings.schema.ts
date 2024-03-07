import { sql } from 'drizzle-orm';
import {
  boolean,
  int,
  mysqlTable,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { users } from './users.schema';

export const userSettings = mysqlTable('user_settings', {
  id: int('id').primaryKey().autoincrement().notNull(),
  user: int('user')
    .references(() => users.id)
    .notNull()
    .unique(),
  darkMode: boolean('dark_mode').default(false).notNull(),
  language: varchar('language', { length: 10 }).default('en').notNull(),
  notifications: boolean('notifications').default(true).notNull(),
  createdAt: timestamp('created_at', { mode: 'date', fsp: 6 })
    .default(sql`CURRENT_TIMESTAMP(6)`)
    .notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', fsp: 6 })
    .default(sql`CURRENT_TIMESTAMP(6) on update CURRENT_TIMESTAMP(6)`)
    .notNull(),
});
