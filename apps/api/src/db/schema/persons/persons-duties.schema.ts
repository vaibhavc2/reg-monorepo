import { sql } from 'drizzle-orm';
import { index, int, mysqlTable, timestamp } from 'drizzle-orm/mysql-core';
import { users } from '../users/users.schema';
import { duties } from './duties.schema';
import { persons } from './persons.schema';

export const personsDuties = mysqlTable(
  'persons_duties',
  {
    id: int('id').primaryKey().autoincrement().notNull(),
    person: int('person')
      .references(() => persons.id)
      .notNull(),
    duty: int('duty')
      .references(() => duties.id)
      .notNull(),
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
  (personsDuties) => ({
    personDutyIdx: index('person_duty_idx').on(
      personsDuties.person,
      personsDuties.duty,
    ),
  }),
);
