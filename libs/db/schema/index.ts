import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { activities } from './common/activities.schema';
import { duties } from './persons/duties.schema';
import { personsDuties } from './persons/persons-duties.schema';
import { personsHistory } from './persons/persons-history.schema';
import { personsRelations } from './persons/persons-relations.schema';
import { persons } from './persons/persons.schema';
import { relations } from './persons/relations.schema';
import { vehiclesTypes } from './persons/vehicle-types.schema';
import { vehiclesOwners } from './persons/vehicles-owners.schema';
import { vehicles } from './persons/vehicles.schema';
import { displayNames } from './users/display-names.schema';
import { emailCredentials } from './users/email-credentials.schema';
import { otps } from './users/otps.schema';
import { phoneDetails } from './users/phone-details.schema';
import { requests } from './users/requests.schema';
import { tokens } from './users/tokens.schema';
import { userSessions } from './users/user-sessions.schema';
import { userSettings } from './users/user-settings.schema';
import { usersHistory } from './users/users-history.schema';
import { users } from './users/users.schema';
import { verifications } from './users/verifications.schema';

// export schemas
export const schema = {
  activities,
  displayNames,
  duties,
  emailCredentials,
  otps,
  tokens,
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
};

// export schemas separately
export {
  activities,
  displayNames,
  duties,
  emailCredentials,
  otps,
  persons,
  personsDuties,
  personsHistory,
  personsRelations,
  phoneDetails,
  relations,
  requests,
  tokens,
  userSessions,
  userSettings,
  users,
  usersHistory,
  vehicles,
  vehiclesOwners,
  vehiclesTypes,
  verifications,
};

// types
export type { IActivity } from './common/activities.schema';
export type { IDuty } from './persons/duties.schema';
export type { IPersonDuty } from './persons/persons-duties.schema';
export type { IPersonHistory } from './persons/persons-history.schema';
export type { IPersonRelation } from './persons/persons-relations.schema';
export type { IPerson } from './persons/persons.schema';
export type { IRelation } from './persons/relations.schema';
export type { IVehicleType } from './persons/vehicle-types.schema';
export type { IVehicleOwner } from './persons/vehicles-owners.schema';
export type { IVehicle } from './persons/vehicles.schema';
export type { IDisplayName } from './users/display-names.schema';
export type { IEmailCredential } from './users/email-credentials.schema';
export type { IOTP } from './users/otps.schema';
export type { IPhoneDetails } from './users/phone-details.schema';
export type { IRequest } from './users/requests.schema';
export type { IToken } from './users/tokens.schema';
export type { IUserSession } from './users/user-sessions.schema';
export type { IUserSetting } from './users/user-settings.schema';
export type { IUserHistory } from './users/users-history.schema';
export type { IUser } from './users/users.schema';
export type { IVerification } from './users/verifications.schema';

// Insert schemas
export const insertSchema = {
  activities: createInsertSchema(activities),
  displayNames: createInsertSchema(displayNames),
  duties: createInsertSchema(duties),
  otps: createInsertSchema(otps),
  tokens: createInsertSchema(tokens),
  persons: createInsertSchema(persons),
  personsDuties: createInsertSchema(personsDuties),
  personsHistory: createInsertSchema(personsHistory),
  personsRelations: createInsertSchema(personsRelations),
  relations: createInsertSchema(relations),
  requests: createInsertSchema(requests),
  emailCredentials: createInsertSchema(emailCredentials),
  userSessions: createInsertSchema(userSessions),
  userSettings: createInsertSchema(userSettings),
  users: createInsertSchema(users),
  usersHistory: createInsertSchema(usersHistory),
  vehicles: createInsertSchema(vehicles),
  vehiclesOwners: createInsertSchema(vehiclesOwners),
  vehiclesTypes: createInsertSchema(vehiclesTypes),
  verifications: createInsertSchema(verifications),
  phoneDetails: createInsertSchema(phoneDetails),
};

// Select schemas
export const selectSchema = {
  activities: createSelectSchema(activities),
  displayNames: createSelectSchema(displayNames),
  duties: createSelectSchema(duties),
  otps: createSelectSchema(otps),
  tokens: createSelectSchema(tokens),
  persons: createSelectSchema(persons),
  personsDuties: createSelectSchema(personsDuties),
  personsHistory: createSelectSchema(personsHistory),
  personsRelations: createSelectSchema(personsRelations),
  relations: createSelectSchema(relations),
  requests: createSelectSchema(requests),
  emailCredentials: createSelectSchema(emailCredentials),
  userSessions: createSelectSchema(userSessions),
  userSettings: createSelectSchema(userSettings),
  users: createSelectSchema(users),
  usersHistory: createSelectSchema(usersHistory),
  vehicles: createSelectSchema(vehicles),
  vehiclesOwners: createSelectSchema(vehiclesOwners),
  vehiclesTypes: createSelectSchema(vehiclesTypes),
  verifications: createSelectSchema(verifications),
  phoneDetails: createSelectSchema(phoneDetails),
};
