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

export const relations = mysqlTable(
  'relations',
  {
    id: int('id').primaryKey().autoincrement().notNull(),
    title: varchar('title', { length: 256 }).notNull().unique(),
    value: varchar('value', { length: 256 }).notNull().unique(),
    disabled: boolean('disabled').default(false).notNull(),
    addedBy: int('added_by')
      .references(() => users.id)
      .notNull(),
    updatedBy: int('updated_by').references(() => users.id),
    createdAt: timestamp('created_at', { mode: 'date', fsp: 6 })
      .default(sql`CURRENT_TIMESTAMP(6)`)
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date', fsp: 6 })
      .default(sql`CURRENT_TIMESTAMP(6) on update CURRENT_TIMESTAMP(6)`)
      .notNull(),
  },
  (relations) => ({
    titleIdx: index('title_idx').on(relations.title),
    valueIdx: index('value_idx').on(relations.value),
  }),
);
