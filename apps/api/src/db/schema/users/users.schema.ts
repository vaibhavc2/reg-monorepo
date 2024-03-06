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
    verified: boolean('verified').default(false).notNull(),
    //TODO: this should be true ONLY if emailVerified and phoneVerified are true, and admin or moderator has verified the user
    disabled: boolean('disabled').default(false).notNull(),
    createdAt: timestamp('created_at')
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: timestamp('updated_at')
      .default(sql`CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (users) => ({
    fullNameIdx: index('full_name_idx').on(users.fullName),
  }),
);
