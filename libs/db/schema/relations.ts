import { relations as declareRelations } from 'drizzle-orm';
import {
  activities,
  displayNames,
  duties,
  emailCredentials,
  persons,
  personsDuties,
  personsHistory,
  personsRelations,
  phoneDetails,
  relations,
  requests,
  userSessions,
  userSettings,
  users,
  usersHistory,
  vehicles,
  vehiclesOwners,
  vehiclesTypes,
  verifications,
} from '../schema';

export const usersTableRelations = declareRelations(users, ({ one, many }) => ({
  emailCredentials: one(emailCredentials),
  phoneDetails: one(phoneDetails),
  requests: many(requests),
  userSessions: many(userSessions),
  verifications: one(verifications),
  userSettings: one(userSettings),
  usersHistory: many(usersHistory),
  displayNames: one(displayNames),
  activities: many(activities),
  persons: many(persons),
  duties: many(duties),
  vehicles: many(vehicles),
  vehiclesOwners: many(vehiclesOwners),
  vehiclesTypes: many(vehiclesTypes),
  relations: many(relations),
  personsRelations: many(personsRelations),
  personsHistory: many(personsHistory),
  personsDuties: many(personsDuties),
}));

export const personsTableRelations = declareRelations(
  persons,
  ({ one, many }) => ({
    vehiclesOwners: many(vehiclesOwners),
    personsRelations: many(personsRelations),
    personsHistory: one(personsHistory),
    personsDuties: many(personsDuties),
  }),
);

export const vehiclesTableRelations = declareRelations(
  vehicles,
  ({ one, many }) => ({
    vehiclesOwners: many(vehiclesOwners),
  }),
);

export const vehiclesTypesTableRelations = declareRelations(
  vehiclesTypes,
  ({ one, many }) => ({
    vehicles: many(vehicles),
  }),
);

export const relationsTableRelations = declareRelations(
  relations,
  ({ one, many }) => ({
    personsRelations: many(personsRelations),
  }),
);

export const dutiesTableRelations = declareRelations(
  duties,
  ({ one, many }) => ({
    personsDuties: many(personsDuties),
  }),
);
