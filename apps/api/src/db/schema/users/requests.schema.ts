import { sql } from 'drizzle-orm';
import {
  boolean,
  index,
  int,
  mysqlTable,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { users } from './users.schema';

export const requests = mysqlTable(
  'requests',
  {
    id: int('id').primaryKey().autoincrement().notNull(),
    sender: int('sender')
      .references(() => users.id)
      .unique()
      .notNull(),
    title: varchar('title', { length: 256 }),
    description: varchar('description', { length: 256 }),
    accepted: boolean('accepted').default(false).notNull(),
    acceptedBy: int('added_by').references(() => users.id),
    acceptedAt: timestamp('accepted_at', { mode: 'date', fsp: 6 }),
    createdAt: timestamp('created_at', { mode: 'date', fsp: 6 })
      .default(sql`CURRENT_TIMESTAMP(6)`)
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date', fsp: 6 })
      .default(sql`CURRENT_TIMESTAMP(6) on update CURRENT_TIMESTAMP(6)`)
      .notNull(),
  },
  (requests) => ({
    senderIdx: index('sender_idx').on(requests.sender),
    titleIdx: index('title_idx').on(requests.title),
  }),
);
