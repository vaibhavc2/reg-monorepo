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

export const devices = mysqlTable(
  'devices',
  {
    id: int('id').primaryKey().autoincrement().notNull(),
    user: int('user')
      .references(() => users.id)
      .notNull(),
    name: varchar('name', { length: 256 }).notNull(),
    model: varchar('model', { length: 256 }).notNull(),
    type: mysqlEnum('type', db_ct.deviceType).notNull(),
    manufacturer: varchar('manufacturer', { length: 256 }).notNull(),
    os: varchar('os', { length: 256 }).notNull(),
    osVersion: varchar('os_version', { length: 256 }).notNull(),
    disabled: boolean('disabled').default(false).notNull(),
    createdAt: timestamp('created_at', { mode: 'date', fsp: 6 })
      .default(sql`CURRENT_TIMESTAMP(6)`)
      .notNull(),
  },
  (devices) => ({
    osIdx: index('os_idx').on(devices.os),
    typeIdx: index('type_idx').on(devices.type),
  }),
);

export type IDevice = typeof devices;
