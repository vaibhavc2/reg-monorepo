import { database } from '@/db';
import { apiResponse } from '@/services';
import { contracts } from '@reg/contracts';
import { emailCredentials, phoneDetails } from '@reg/db';
import { AppRouteImplementation } from '@ts-rest/express';
import { eq } from 'drizzle-orm';

type Validate = (typeof contracts.v1.UserContract)['validate'];
type ValidateHandler = AppRouteImplementation<Validate>;

export const validateHandler: ValidateHandler = async ({
  query: { email, phone },
  params: { credential },
}) => {
  if (credential === 'email') {
    // get the user email
    const creds = await database.db
      ?.select({
        email: emailCredentials.email,
      })
      .from(emailCredentials)
      .where(eq(emailCredentials.email, String(email)));

    // if email not found, then the user can proceed to register
    if (creds?.[0]?.email === email) {
      return apiResponse.error(400, 'Email already exists!');
    }
  } else if (credential === 'phone') {
    // get the user phone
    const details = await database.db
      ?.select({
        phone: phoneDetails.phone,
      })
      .from(phoneDetails)
      .where(eq(phoneDetails.phone, String(phone)));

    // if phone not found, then the user can proceed to register
    if (details?.[0]?.phone === phone) {
      return apiResponse.error(400, 'Phone already exists!');
    }
  } else {
    return apiResponse.error(400, 'Invalid credential!');
  }

  // return success
  return apiResponse.res(200, 'Success! User can proceed to register!');
};
