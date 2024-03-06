import { sql } from 'drizzle-orm';
import { index, int, mysqlTable, timestamp } from 'drizzle-orm/mysql-core';
import { users } from '../users/users.schema';
import { persons } from './persons.schema';
import { vehicles } from './vehicles.schema';

export const vehiclesOwners = mysqlTable(
  'vehicles_owners',
  {
    id: int('id').primaryKey().autoincrement().notNull(),
    vehicle: int('vehicle')
      .references(() => vehicles.id)
      .notNull(),
    person: int('person')
      .references(() => persons.id)
      .notNull(),
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
  (vehiclesOwners) => ({
    vehiclePersonIdx: index('vehicle_person_idx').on(
      vehiclesOwners.vehicle,
      vehiclesOwners.person,
    ),
  }),
);
