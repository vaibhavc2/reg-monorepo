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
    createdAt: timestamp('created_at', { mode: 'date', fsp: 6 })
      .default(sql`CURRENT_TIMESTAMP(6)`)
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date', fsp: 6 })
      .default(sql`CURRENT_TIMESTAMP(6) on update CURRENT_TIMESTAMP(6)`)
      .notNull(),
  },
  (personsDuties) => ({
    personDutyIdx: index('person_duty_idx').on(
      personsDuties.person,
      personsDuties.duty,
    ),
  }),
);

export type IPersonDuty = typeof personsDuties;
