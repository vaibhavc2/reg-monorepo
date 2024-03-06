import { sql } from 'drizzle-orm';
import {
  boolean,
  index,
  int,
  mysqlTable,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { users } from '../users/users.schema';

export const duties = mysqlTable(
  'duties',
  {
    id: int('id').primaryKey().autoincrement().notNull(),
    title: varchar('title', { length: 256 }).notNull().unique(),
    value: varchar('value', { length: 256 }).notNull().unique(),
    disabled: boolean('disabled').default(false).notNull(),
    // TODO: only admin or moderator can add or update duties
    addedBy: int('added_by')
      .references(() => users.id)
      .notNull(),
    updatedBy: int('updated_by').references(() => users.id),
    createdAt: timestamp('created_at')
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: timestamp('updated_at')
      .default(sql`CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (duties) => ({
    titleIdx: index('title_idx').on(duties.title),
    valueIdx: index('value_idx').on(duties.value),
  }),
);
