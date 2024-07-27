import ct from '@/constants';
import { database } from '@/db';
import { apiResponse } from '@/services';
import { checkModerator } from '@/utils';
import { contracts } from '@reg/contracts';
import { persons, vehicles, vehiclesOwners, vehiclesTypes } from '@reg/db';
import { AppRouteImplementation } from '@ts-rest/express';
import { eq } from 'drizzle-orm';
import { isValidPhoneNumber } from 'libphonenumber-js';

type AddPerson = (typeof contracts.v1.persons)['add-person'];
type AddPersonHandler = AppRouteImplementation<AddPerson>;

export const addPersonHandler: AddPersonHandler = async ({
  req: { user },
  body: {
    fullName,
    phone,
    age,
    address,
    city,
    state,
    vehicleType,
    vehicleNumber,
  },
}) => {
  // check if the user is a moderator or admin
  if (!user || !checkModerator(user)) {
    return apiResponse.error(403, 'Forbidden!');
  }

  // validate phone number
  if (!isValidPhoneNumber(phone, 'IN')) {
    return apiResponse.error(400, 'Invalid phone number!');
  }

  // start a db transaction
  const { person } =
    (await database.db?.transaction(async (trx) => {
      // add person
      await trx.insert(persons).values({
        fullName,
        phone,
        age,
        address,
        city,
        state,
        addedBy: user.id,
      });

      const person = (
        await trx.select().from(persons).where(eq(persons.phone, phone))
      )?.[0];

      // add vehicle
      if (!vehicleType && !vehicleNumber) return { person };

      // verify the vehicle type
      const type = (
        await trx
          .select()
          .from(vehiclesTypes)
          .where(eq(vehiclesTypes.id, vehicleType as number))
      )?.[0];

      // if the vehicle type is not valid
      if (!type) {
        return trx.rollback();
      }

      // add vehicle
      const { insertId } =
        (
          await trx.insert(vehicles).values({
            type: type.id,
            regNumber: vehicleNumber,
            addedBy: user.id,
          })
        )?.[0] ?? {};

      if (!insertId) return trx.rollback();

      // add vehicles owners
      await trx.insert(vehiclesOwners).values({
        vehicle: insertId,
        person: person.id,
        addedBy: user.id,
      });

      return {
        person: {
          ...person,
          vehicle: vehicleType
            ? {
                type: type?.title,
                regNumber: vehicleNumber,
              }
            : null,
        },
      };
    }, ct.dbTransactionConfig)) ?? {};

  // check if person was added
  if (!person) {
    return apiResponse.serverError();
  }

  // return success
  return apiResponse.res(201, 'Person added successfully!', {
    person,
  });
};
