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

export const tokens = mysqlTable(
  'tokens',
  {
    id: bigint('id', { mode: 'number', unsigned: true })
      .primaryKey()
      .autoincrement()
      .notNull(),
    user: int('user')
      .references(() => users.id)
      .notNull(),
    objective: mysqlEnum('objective', db_ct.objectives).notNull(),
    token: varchar('token', { length: 256 }).notNull().unique(),
    tokenType: mysqlEnum('token_type', ['']).notNull(),
    // TODO: make sure to add a method to admin to delete all or some expired tokens (also acc to time-range and attempts)
    expiredAt: timestamp('expired_at', { mode: 'date', fsp: 6 }).notNull(), // 5 minutes
    // TODO: make it configurable
    verified: boolean('verified').default(false).notNull(),
    createdAt: timestamp('created_at', { mode: 'date', fsp: 6 })
      .default(sql`CURRENT_TIMESTAMP(6)`)
      .notNull(),
  },
  (tokens) => ({
    userIdx: index('user_idx').on(tokens.user),
  }),
);

export type IToken = typeof tokens;
