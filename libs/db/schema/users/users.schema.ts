import { sql } from 'drizzle-orm';
import {
  boolean,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';

export const users = mysqlTable(
  'users',
  {
    id: int('id').primaryKey().autoincrement().notNull(),
    fullName: varchar('full_name', { length: 256 }).notNull(),
    avatar: varchar('avatar', { length: 256 }),
    cover: varchar('cover', { length: 256 }),
    role: mysqlEnum('role', ['user', 'moderator', 'admin'])
      .default('user')
      .notNull(),
    disabled: boolean('disabled').default(false).notNull(),
    createdAt: timestamp('created_at', { mode: 'date', fsp: 6 })
      .default(sql`CURRENT_TIMESTAMP(6)`)
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date', fsp: 6 })
      .default(sql`CURRENT_TIMESTAMP(6) on update CURRENT_TIMESTAMP(6)`)
      .notNull(),
  },
  (users) => ({
    fullNameIdx: index('full_name_idx').on(users.fullName),
  }),
);

export type IUser = typeof users;
