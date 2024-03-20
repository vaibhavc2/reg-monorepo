import { sql } from 'drizzle-orm';
import {
  index,
  int,
  mysqlTable,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { users } from './users.schema';

export const phoneDetails = mysqlTable(
  'phone_details',
  {
    id: int('id').primaryKey().autoincrement().notNull(),
    user: int('user')
      .references(() => users.id)
      .notNull()
      .unique(),
    phone: varchar('phone', { length: 20 }).notNull().unique(), // use e164 format
    createdAt: timestamp('created_at', { mode: 'date', fsp: 6 })
      .default(sql`CURRENT_TIMESTAMP(6)`)
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date', fsp: 6 })
      .default(sql`CURRENT_TIMESTAMP(6) on update CURRENT_TIMESTAMP(6)`)
      .notNull(),
  },
  (phoneDetails) => ({
    phoneIdx: index('phone_idx').on(phoneDetails.phone),
  }),
);

export type IPhoneDetails = typeof phoneDetails;
