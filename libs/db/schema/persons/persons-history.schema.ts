import { sql } from 'drizzle-orm';
import { index, int, mysqlTable, timestamp } from 'drizzle-orm/mysql-core';
import { activities } from '../common/activities.schema';
import { persons } from './persons.schema';

export const personsHistory = mysqlTable(
  'persons_history',
  {
    id: int('id').primaryKey().autoincrement().notNull(),
    person: int('person')
      .references(() => persons.id)
      .notNull(),
    activity: int('activity')
      .references(() => activities.id)
      .notNull(),
    createdAt: timestamp('created_at', { mode: 'date', fsp: 6 })
      .default(sql`CURRENT_TIMESTAMP(6)`)
      .notNull(),
    // TODO: setup deletion of old records after a certain period of time automatically
  },
  (personsHistory) => ({
    activityIdx: index('activity_idx').on(personsHistory.activity),
  }),
);

export type IPersonHistory = typeof personsHistory;
