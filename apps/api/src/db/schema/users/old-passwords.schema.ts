import { sql } from 'drizzle-orm';
import { int, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';
import { users } from './users.schema';

export const oldPasswords = mysqlTable(
  'old_passwords',
  {
    id: int('id').primaryKey().autoincrement().notNull(),
    user: int('user')
      .references(() => users.id)
      .notNull(),
    password: varchar('password', { length: 256 }).notNull(),
    salt: varchar('salt', { length: 256 }).notNull(),
    createdAt: timestamp('created_at', { mode: 'date', fsp: 6 })
      .default(sql`CURRENT_TIMESTAMP(6)`)
      .notNull(),
  },
  // TODO: automatically delete oldPasswords after 6 months!!
  // TODO: make sure that the password is not the same as the last 3 passwords (if available)
  // TODO: make sure to add a method to admin to delete all or some expired oldPasswords (also acc to time-range)
  // TODO: delete all oldPasswords when the user is deleted
);
