import { sql } from 'drizzle-orm';
import { index, int, mysqlTable, timestamp } from 'drizzle-orm/mysql-core';
import { users } from '../../schema/users/users.schema';
import { activities } from '../common/activities.schema';

export const usersHistory = mysqlTable(
  'users_history',
  {
    id: int('id').primaryKey().autoincrement().notNull(),
    user: int('user')
      .references(() => users.id)
      .notNull(),
    activity: int('activity')
      .references(() => activities.id)
      .notNull(),
    createdAt: timestamp('created_at', { mode: 'date', fsp: 6 })
      .default(sql`CURRENT_TIMESTAMP(6)`)
      .notNull(),
    // TODO: setup deletion of old records after a certain period of time automatically
  },
  (usersHistory) => ({
    activityIdx: index('activity_idx').on(usersHistory.activity),
  }),
);

export type IUserHistory = typeof usersHistory;
