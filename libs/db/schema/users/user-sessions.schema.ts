import { sql } from 'drizzle-orm';
import {
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

export const userSessions = mysqlTable(
  'user_sessions',
  {
    id: int('id').primaryKey().autoincrement().notNull(),
    user: int('user')
      .references(() => users.id)
      .notNull(),
    authType: mysqlEnum('auth_type', db_ct.authType)
      .default('google')
      .notNull(),
    token: varchar('token', { length: 256 }).notNull().unique(),
    expiredAt: timestamp('expired_at', { mode: 'date', fsp: 6 }),
    revoked: boolean('revoked').default(false).notNull(),
    revokedAt: timestamp('revoked_at', { mode: 'date', fsp: 6 }),
    revokedBy: int('revoked_by').references(() => users.id),
    // TODO: only admin can revoke the session of any other user
    createdAt: timestamp('created_at', { mode: 'date', fsp: 6 })
      .default(sql`CURRENT_TIMESTAMP(6)`)
      .notNull(),
  },
  (userSessions) => ({
    userIdx: index('user_idx').on(userSessions.user),
    authTypeIdx: index('auth_type_idx').on(userSessions.authType),
  }),
);

export type IUserSession = typeof userSessions;
