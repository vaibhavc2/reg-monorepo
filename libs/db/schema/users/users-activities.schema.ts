import { sql } from 'drizzle-orm';
import {
  boolean,
  index,
  int,
  mysqlTable,
  timestamp,
} from 'drizzle-orm/mysql-core';
import { activities } from '../../schema/common/activities.schema';
import { users } from '../../schema/users/users.schema';

export const usersActivities = mysqlTable(
  'users-activities',
  {
    id: int('id').primaryKey().autoincrement().notNull(),
    user: int('user')
      .references(() => users.id)
      .notNull(),
    activity: int('activity')
      .references(() => activities.id)
      .notNull(),
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
    // ! make sure only admin or moderator can add and update this table
  },
  (usersActivities) => ({
    userActivityIdx: index('user_activity_idx').on(
      usersActivities.user,
      usersActivities.activity,
    ),
  }),
);

export type IUserActivity = typeof usersActivities;
