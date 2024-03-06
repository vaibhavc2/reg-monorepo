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
    verifiedAt: timestamp('verified_at'),
    createdAt: timestamp('created_at')
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: timestamp('updated_at')
      .default(sql`CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (verifications) => ({
    userIdx: index('user_idx').on(verifications.user),
  }),
);
