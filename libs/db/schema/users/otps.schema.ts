import { sql } from 'drizzle-orm';
import {
  bigint,
  boolean,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { db_ct } from '../../constants';
import { users } from './users.schema';

export const otps = mysqlTable(
  'otps',
  {
    id: bigint('id', { mode: 'number', unsigned: true })
      .primaryKey()
      .autoincrement()
      .notNull(),
    user: int('user')
      .references(() => users.id)
      .notNull(),
    otpType: mysqlEnum('otp_type', db_ct.otpType).notNull(),
    objective: mysqlEnum('objective', db_ct.objective).notNull(),
    code: varchar('code', { length: 6 }).notNull(),
    // TODO: add a check constraint to make sure that the code is 6 digits
    // TODO: make sure to add a method to admin to delete all or some expired otps (also acc to time-range and attempts)
    expiredAt: timestamp('expired_at', { mode: 'date', fsp: 6 }).notNull(), // 5 minutes
    // TODO: make it configurable
    verified: boolean('verified').default(false).notNull(),
    attempts: int('attempts').default(0).notNull(), // 3 attempts
    createdAt: timestamp('created_at', { mode: 'date', fsp: 6 })
      .default(sql`CURRENT_TIMESTAMP(6)`)
      .notNull(),
  },
  (otps) => ({
    userIdx: index('user_idx').on(otps.user),
  }),
);

export type IOTP = typeof otps;
