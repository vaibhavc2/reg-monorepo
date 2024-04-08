import { database } from '@/db';
import { apiResponse } from '@/services';
import { contracts } from '@reg/contracts';
import {
  emailCredentials,
  emailValidations,
  phoneDetails,
  phoneValidations,
} from '@reg/db';
import { AppRouteImplementation } from '@ts-rest/express';
import { eq } from 'drizzle-orm';

type Validate = (typeof contracts.v1.UserContract)['validate'];
type ValidateHandler = AppRouteImplementation<Validate>;

// check if the email or phone is verified, not already registered, before proceeding to register
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

    // check if the email is valid
    const validation = await database.db
      ?.select({
        verified: emailValidations.verified,
      })
      .from(emailValidations)
      .where(eq(emailValidations.email, String(email)));

    // if the email is verified, only then the user can proceed to register
    if (!validation?.[0]?.verified) {
      return apiResponse.error(403, 'Verify email first!');
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

    // check if the phone is valid
    const validation = await database.db
      ?.select({
        verified: phoneValidations.verified,
      })
      .from(phoneValidations)
      .where(eq(phoneValidations.phone, String(phone)));

    // if the phone is verified, only then the user can proceed to register
    if (!validation?.[0]?.verified) {
      return apiResponse.error(403, 'Verify phone first!');
    }
  } else {
    return apiResponse.error(400, 'Invalid credential!');
  }

  // return success
  return apiResponse.res(200, 'Success! User can proceed to register!');
};
