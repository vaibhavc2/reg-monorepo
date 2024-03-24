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
import { users } from '../../schema/users/users.schema';

export const activities = mysqlTable(
  'activities',
  {
    id: int('id').primaryKey().autoincrement().notNull(),
    title: varchar('title', { length: 256 }).notNull().unique(),
    description: varchar('description', { length: 256 }),
    activityType: mysqlEnum('activity_type', ['users', 'persons']).notNull(),
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
    // ! make sure only admin can add and update this table
  },
  (activities) => ({
    titleIdx: index('title_idx').on(activities.title),
    activityTypeIdx: index('activity_type_idx').on(activities.activityType),
  }),
);

export type IActivity = typeof activities;
