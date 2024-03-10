import { sql } from 'drizzle-orm';
import {
  index,
  int,
  mysqlTable,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { users } from './users.schema';

export const displayNames = mysqlTable(
  'display_names',
  {
    id: int('id').primaryKey().autoincrement().notNull(),
    user: int('user')
      .references(() => users.id)
      .notNull()
      .unique(),
    value: varchar('value', { length: 20 }).notNull().unique(),
    setBy: int('set_by')
      .references(() => users.id)
      .notNull(),
    updatedBy: int('updated_by').references(() => users.id),
    // TODO: make sure that the setBy and updatedBy is a moderator or admin!! (moderator can update only their own displayNames, admin can update any nickname)
    createdAt: timestamp('created_at', { mode: 'date', fsp: 6 })
      .default(sql`CURRENT_TIMESTAMP(6)`)
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date', fsp: 6 })
      .default(sql`CURRENT_TIMESTAMP(6) on update CURRENT_TIMESTAMP(6)`)
      .notNull(),
  },
  (displayNames) => ({
    valueIdx: index('value_idx').on(displayNames.value),
  }),
);

export type IDisplayName = typeof displayNames;
