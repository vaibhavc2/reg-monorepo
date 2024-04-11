import { sql } from 'drizzle-orm';
import {
  index,
  int,
  mysqlEnum,
  mysqlTable,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { db_ct } from '../../constants';

export const users = mysqlTable(
  'users',
  {
    id: int('id').primaryKey().autoincrement().notNull(),
    fullName: varchar('full_name', { length: 256 }).notNull(),
    avatar: varchar('avatar', { length: 256 }),
    cover: varchar('cover', { length: 256 }),
    role: mysqlEnum('role', db_ct.userRole).default('user').notNull(),
    status: mysqlEnum('status', db_ct.userStatus).default('active').notNull(),
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
