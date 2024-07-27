import ct from '@/constants';
import { database } from '@/db';
import { apiResponse } from '@/services';
import { checkModerator } from '@/utils';
import { contracts } from '@reg/contracts';
import { persons, vehicles, vehiclesOwners, vehiclesTypes } from '@reg/db';
import { AppRouteImplementation } from '@ts-rest/express';
import { eq } from 'drizzle-orm';
import { isValidPhoneNumber } from 'libphonenumber-js';

type GetPersons = (typeof contracts.v1.persons)['get-persons'];
type GetPersonsHandler = AppRouteImplementation<GetPersons>;

export const getPersonsHandler: GetPersonsHandler = async ({
  req: { user },
  query: { order, cursor, pageSize },
}) => {
  // check if the user is a moderator or admin
  if (!user || !checkModerator(user)) {
    return apiResponse.error(403, 'Forbidden!');
  }

  // get persons page
  const persons = await database.db?.query.persons
    .findMany()
    // .orderBy(vehiclesOwners.addedAt, order === 'asc' ? 'asc' : 'desc')
    // .limit(pageSize)
    // .offset(cursor)
    .prepare()
    .execute();

  return apiResponse.res(200, 'Persons page fetched successfully!', persons);
};
