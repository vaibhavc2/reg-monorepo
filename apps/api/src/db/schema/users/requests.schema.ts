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
    acceptedAt: timestamp('accepted_at'),
    createdAt: timestamp('created_at')
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: timestamp('updated_at')
      .default(sql`CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (requests) => ({
    senderIdx: index('sender_idx').on(requests.sender),
    titleIdx: index('title_idx').on(requests.title),
  }),
);
