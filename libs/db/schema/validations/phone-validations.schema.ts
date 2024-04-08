import { sql } from 'drizzle-orm';
import {
  bigint,
  boolean,
  index,
  mysqlTable,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';

export const phoneValidations = mysqlTable(
  'phone-validations',
  {
    id: bigint('id', { mode: 'number', unsigned: true })
      .primaryKey()
      .autoincrement()
      .notNull(),
    phone: varchar('phone', { length: 20 }).notNull().unique(), // use e164 format
    verified: boolean('verified').default(false).notNull(),
    disabled: boolean('disabled').default(false).notNull(),
    createdAt: timestamp('created_at', { mode: 'date', fsp: 6 })
      .default(sql`CURRENT_TIMESTAMP(6)`)
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date', fsp: 6 })
      .default(sql`CURRENT_TIMESTAMP(6) on update CURRENT_TIMESTAMP(6)`)
      .notNull(),
  },
  (phoneValidations) => ({
    phoneIdx: index('phone_idx').on(phoneValidations.phone),
  }),
);

export type IPhoneValidation = typeof phoneValidations;
