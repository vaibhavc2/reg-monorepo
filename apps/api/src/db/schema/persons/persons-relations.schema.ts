import { sql } from 'drizzle-orm';
import { index, int, mysqlTable, timestamp } from 'drizzle-orm/mysql-core';
import { users } from '../users/users.schema';
import { persons } from './persons.schema';
import { relations } from './relations.schema';

export const personsRelations = mysqlTable(
  'persons_relations',
  {
    id: int('id').primaryKey().autoincrement().notNull(),
    person1: int('person1')
      .references(() => persons.id)
      .notNull(),
    person2: int('person2')
      .references(() => persons.id)
      .notNull(),
    relation: int('relation')
      .references(() => relations.id)
      .notNull(),
    addedBy: int('added_by')
      .references(() => users.id)
      .notNull(),
    updatedBy: int('updated_by').references(() => users.id),
    createdAt: timestamp('created_at', { mode: 'date', fsp: 6 })
      .default(sql`CURRENT_TIMESTAMP(6)`)
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date', fsp: 6 })
      .default(sql`CURRENT_TIMESTAMP(6) on update CURRENT_TIMESTAMP(6)`)
      .notNull(),
  },
  (personsRelations) => ({
    personRelationIdx: index('person_relation_idx').on(
      personsRelations.person1,
      personsRelations.person2,
      personsRelations.relation,
    ),
  }),
);
