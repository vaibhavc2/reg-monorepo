import { sql } from 'drizzle-orm';
import {
  boolean,
  index,
  int,
  mysqlTable,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { users } from '..';

export const otpTypes = mysqlTable(
  'otp_types',
  {
    // TODO: add a check constraint to make sure that the code is 6 digits
    // login, signup, reset-password, change-email, change-phone, change-credential, verify-email, verify-phone, verify-credential, settings
    id: int('id').primaryKey().autoincrement().notNull(),
    title: varchar('name', { length: 50 }).notNull(),
    description: varchar('description', { length: 255 }).notNull(),
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
  (otpTypes) => ({
    titleIdx: index('title_idx').on(otpTypes.title),
  }),
);
