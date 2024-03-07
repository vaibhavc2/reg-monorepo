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
    age: tinyint('age').notNull(),
    fullName: varchar('full_name', { length: 256 }).notNull(),
    displayName: varchar('display_name', { length: 20 }),
    disabled: boolean('disabled').default(false).notNull(),
    phone: varchar('phone', { length: 20 }).notNull().unique(),
    email: varchar('email', { length: 256 }).unique(),
    address: varchar('address', { length: 256 }),
    city: varchar('city', { length: 256 }),
    state: varchar('state', { length: 256 }),
    // TODO: only admin or moderator can add or update persons
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
    displayNameIdx: index('display_name_idx').on(persons.displayName),
    phoneIdx: index('phone_idx').on(persons.phone),
    emailIdx: index('email_idx').on(persons.email),
    city: index('city_idx').on(persons.city),
    state: index('state_idx').on(persons.state),
  }),
);
