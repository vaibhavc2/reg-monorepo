import { sql } from 'drizzle-orm';
import {
  bigint,
  boolean,
  index,
  mysqlTable,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';

export const emailValidations = mysqlTable(
  'email-validations',
  {
    id: bigint('id', { mode: 'number', unsigned: true })
      .primaryKey()
      .autoincrement()
      .notNull(),
    email: varchar('email', { length: 256 }).unique().notNull(),
    verified: boolean('verified').default(false).notNull(),
    disabled: boolean('disabled').default(false).notNull(),
    createdAt: timestamp('created_at', { mode: 'date', fsp: 6 })
      .default(sql`CURRENT_TIMESTAMP(6)`)
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date', fsp: 6 })
      .default(sql`CURRENT_TIMESTAMP(6) on update CURRENT_TIMESTAMP(6)`)
      .notNull(),
  },
  (emailValidations) => ({
    emailIdx: index('email_idx').on(emailValidations.email),
  }),
);

export type IEmailValidation = typeof emailValidations;
