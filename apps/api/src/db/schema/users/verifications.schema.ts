import { sql } from 'drizzle-orm';
import {
  boolean,
  index,
  int,
  mysqlTable,
  timestamp,
} from 'drizzle-orm/mysql-core';
import { users } from './users.schema';

export const verifications = mysqlTable(
  // !every user must have a verification record (create it when the user is created)
  'verifications',
  {
    id: int('id').primaryKey().autoincrement().notNull(),
    user: int('user')
      .references(() => users.id)
      .notNull()
      .unique(),
    status: boolean('status').default(false).notNull(),
    emailVerified: boolean('email_verified').default(false).notNull(),
    phoneVerified: boolean('phone_verified').default(false).notNull(),
    verifiedBy: int('verified_by').references(() => users.id),
    verifiedAt: timestamp('verified_at', { mode: 'date', fsp: 6 }),
    createdAt: timestamp('created_at', { mode: 'date', fsp: 6 })
      .default(sql`CURRENT_TIMESTAMP(6)`)
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date', fsp: 6 })
      .default(sql`CURRENT_TIMESTAMP(6) on update CURRENT_TIMESTAMP(6)`)
      .notNull(),
  },
  (verifications) => ({
    userIdx: index('user_idx').on(verifications.user),
  }),
);
