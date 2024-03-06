import { sql } from 'drizzle-orm';
import {
  boolean,
  index,
  int,
  mysqlTable,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { users } from '../users/users.schema';
import { vehiclesTypes } from './vehicle-types.schema';

export const vehicles = mysqlTable(
  'vehicles',
  {
    id: int('id').primaryKey().autoincrement().notNull(),
    type: int('type')
      .references(() => vehiclesTypes.id)
      .notNull(),
    regNumber: varchar('reg_number', { length: 20 }).notNull().unique(),
    disabled: boolean('disabled').default(false).notNull(),
    addedBy: int('added_by')
      .references(() => users.id)
      .notNull(),
    updatedBy: int('updated_by').references(() => users.id),
    createdAt: timestamp('created_at')
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: timestamp('updated_at')
      .default(sql`CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (vehicles) => ({
    typeIdx: index('type_idx').on(vehicles.type),
    regNumberIdx: index('reg_number_idx').on(vehicles.regNumber),
  }),
);
