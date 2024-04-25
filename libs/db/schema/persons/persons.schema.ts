import { sql } from 'drizzle-orm';
import {
  boolean,
  index,
  int,
  mysqlTable,
  timestamp,
  tinyint,
  varchar,
} from 'drizzle-orm/mysql-core';
import { users } from '../users/users.schema';

export const persons = mysqlTable(
  'persons',
  {
    id: int('id').primaryKey().autoincrement().notNull(),
    age: tinyint('age'),
    fullName: varchar('full_name', { length: 256 }).notNull(),
    phone: varchar('phone', { length: 20 }).notNull().unique(),
    address: varchar('address', { length: 256 }),
    city: varchar('city', { length: 256 }).default('Jalandhar').notNull(),
    state: varchar('state', { length: 256 }).default('Punjab').notNull(),
    // TODO: only admin or moderator can add or update persons
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
  (persons) => ({
    nameIdx: index('name_idx').on(persons.fullName),
    phoneIdx: index('phone_idx').on(persons.phone),
    cityIdx: index('city_idx').on(persons.city),
    stateIdx: index('state_idx').on(persons.state),
    addressIdx: index('address_idx').on(persons.address),
    namePhoneIdx: index('name_phone_idx').on(persons.fullName, persons.phone),
  }),
);

export type IPerson = typeof persons;
