import { sql } from 'drizzle-orm';
import {
  index,
  int,
  mysqlTable,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { users } from './users.schema';

export const usernames = mysqlTable(
  'usernames',
  {
    id: int('id').primaryKey().autoincrement().notNull(),
    user: int('user')
      .references(() => users.id)
      .notNull()
      .unique(),
    value: varchar('value', { length: 20 }).notNull().unique(),
    createdAt: timestamp('created_at')
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: timestamp('updated_at')
      .default(sql`CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (usernames) => ({
    valueIdx: index('value_idx').on(usernames.value),
  }),
);
