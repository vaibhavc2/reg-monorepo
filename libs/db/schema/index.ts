import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
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
import { phoneDetails } from './users/phone-details.schema';
import { requests } from './users/requests.schema';
import { userSessions } from './users/user-sessions.schema';
import { userSettings } from './users/user-settings.schema';
import { usersActivities } from './users/users-activities.schema';
import { usersHistory } from './users/users-history.schema';
import { users } from './users/users.schema';
import { verifications } from './users/verifications.schema';
import { emailValidations } from './validations/email-validations.schema';
import { phoneValidations } from './validations/phone-validations.schema';

// export relations from './relations';
export * as schemaRelations from './relations';

// export schemas
export const schema = {
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
  emailValidations,
  phoneValidations,
  usersActivities,
};

// export schemas separately
export {
  activities,
  displayNames,
  duties,
  emailCredentials,
  emailValidations,
  persons,
  personsDuties,
  personsHistory,
  personsRelations,
  phoneDetails,
  phoneValidations,
  relations,
  requests,
  userSessions,
  userSettings,
  users,
  usersActivities,
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
export type { IPhoneDetail } from './users/phone-details.schema';
export type { IRequest } from './users/requests.schema';
export type { IUserSession } from './users/user-sessions.schema';
export type { IUserSetting } from './users/user-settings.schema';
export type { IUserActivity } from './users/users-activities.schema';
export type { IUserHistory } from './users/users-history.schema';
export type { IUser } from './users/users.schema';
export type { IVerification } from './users/verifications.schema';
export type { IEmailValidation } from './validations/email-validations.schema';
export type { IPhoneValidation } from './validations/phone-validations.schema';

// Insert schemas
export const insertSchema = {
  activities: createInsertSchema(activities),
  displayNames: createInsertSchema(displayNames),
  duties: createInsertSchema(duties),
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
  emailValidations: createInsertSchema(emailValidations),
  phoneValidations: createInsertSchema(phoneValidations),
  usersActivities: createInsertSchema(usersActivities),
};

// Select schemas
export const selectSchema = {
  activities: createSelectSchema(activities),
  displayNames: createSelectSchema(displayNames),
  duties: createSelectSchema(duties),
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
  emailValidations: createSelectSchema(emailValidations),
  phoneValidations: createSelectSchema(phoneValidations),
  usersActivities: createSelectSchema(usersActivities),
};

// insert types
export type InsertActivity = InferInsertModel<typeof activities>;
export type InsertDuty = InferInsertModel<typeof duties>;
export type InsertPersonDuty = InferInsertModel<typeof personsDuties>;
export type InsertPersonHistory = InferInsertModel<typeof personsHistory>;
export type InsertPersonRelation = InferInsertModel<typeof personsRelations>;
export type InsertPerson = InferInsertModel<typeof persons>;
export type InsertRelation = InferInsertModel<typeof relations>;
export type InsertVehicleType = InferInsertModel<typeof vehiclesTypes>;
export type InsertVehicleOwner = InferInsertModel<typeof vehiclesOwners>;
export type InsertVehicle = InferInsertModel<typeof vehicles>;
export type InsertDisplayName = InferInsertModel<typeof displayNames>;
export type InsertEmailCredential = InferInsertModel<typeof emailCredentials>;
export type InsertPhoneDetail = InferInsertModel<typeof phoneDetails>;
export type InsertRequest = InferInsertModel<typeof requests>;
export type InsertUserSession = InferInsertModel<typeof userSessions>;
export type InsertUserSetting = InferInsertModel<typeof userSettings>;
export type InsertUserHistory = InferInsertModel<typeof usersHistory>;
export type InsertUser = InferInsertModel<typeof users>;
export type InsertVerification = InferInsertModel<typeof verifications>;
export type InsertEmailValidation = InferInsertModel<typeof emailValidations>;
export type InsertPhoneValidation = InferInsertModel<typeof phoneValidations>;
export type InsertUserActivity = InferInsertModel<typeof usersActivities>;

// select types
export type SelectActivity = InferSelectModel<typeof activities>;
export type SelectDuty = InferSelectModel<typeof duties>;
export type SelectPersonDuty = InferSelectModel<typeof personsDuties>;
export type SelectPersonHistory = InferSelectModel<typeof personsHistory>;
export type SelectPersonRelation = InferSelectModel<typeof personsRelations>;
export type SelectPerson = InferSelectModel<typeof persons>;
export type SelectRelation = InferSelectModel<typeof relations>;
export type SelectVehicleType = InferSelectModel<typeof vehiclesTypes>;
export type SelectVehicleOwner = InferSelectModel<typeof vehiclesOwners>;
export type SelectVehicle = InferSelectModel<typeof vehicles>;
export type SelectDisplayName = InferSelectModel<typeof displayNames>;
export type SelectEmailCredential = InferSelectModel<typeof emailCredentials>;
export type SelectPhoneDetail = InferSelectModel<typeof phoneDetails>;
export type SelectRequest = InferSelectModel<typeof requests>;
export type SelectUserSession = InferSelectModel<typeof userSessions>;
export type SelectUserSetting = InferSelectModel<typeof userSettings>;
export type SelectUserHistory = InferSelectModel<typeof usersHistory>;
export type SelectUser = InferSelectModel<typeof users>;
export type SelectVerification = InferSelectModel<typeof verifications>;
export type SelectEmailValidation = InferSelectModel<typeof emailValidations>;
export type SelectPhoneValidation = InferSelectModel<typeof phoneValidations>;
export type SelectUserActivity = InferSelectModel<typeof usersActivities>;
