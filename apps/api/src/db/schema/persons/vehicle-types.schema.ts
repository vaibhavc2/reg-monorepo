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

export const vehiclesTypes = mysqlTable(
  'vehicles_types',
  {
    id: int('id').primaryKey().autoincrement().notNull(),
    title: varchar('title', { length: 20 }).notNull().unique(),
    description: varchar('description', { length: 256 }),
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
  (vehiclesTypes) => ({
    titleIdx: index('title_idx').on(vehiclesTypes.title),
  }),
);
