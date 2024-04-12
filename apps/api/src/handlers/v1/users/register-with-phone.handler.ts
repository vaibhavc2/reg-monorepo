import ct from '@/constants';
import { database } from '@/db';
import { apiResponse, jwt, names } from '@/services';
import { contracts } from '@reg/contracts';
import { phoneDetails, phoneValidations, userSessions, users } from '@reg/db';
import { AppRouteImplementation } from '@ts-rest/express';
import { eq } from 'drizzle-orm';
import { isValidPhoneNumber } from 'libphonenumber-js';

type RegisterWithPhone =
  (typeof contracts.v1.UserContract)['register-with-phone'];
type RegisterWithPhoneHandler = AppRouteImplementation<RegisterWithPhone>;

export const registerWithPhoneHandler: RegisterWithPhoneHandler = async ({
  headers,
  body: { phone },
  req: { user: loggedInUser },
  res,
}) => {
  // check if the user is already logged in
  if (loggedInUser) {
    return apiResponse.error(400, 'User already logged in!');
  }

  // validate the phone number: only Indian numbers are allowed
  // input phone number should be in the format: +91XXXXXXXXXX i.e. e164 format
  if (!isValidPhoneNumber(phone, 'IN')) {
    return apiResponse.error(400, 'Invalid phone number!');
  }

  // check if the user is already registered
  const existingUser = (
    await database.db
      ?.select()
      .from(phoneDetails)
      .where(eq(phoneDetails.phone, phone))
  )?.[0];

  if (existingUser) {
    return apiResponse.error(400, 'User already exists!');
  }

  // check if the phone is verified earlier
  const phoneValidation = (
    await database.db
      ?.select()
      .from(phoneValidations)
      .where(eq(phoneValidations.phone, phone))
  )?.[0];

  if (
    !phoneValidation ||
    !phoneValidation.verified ||
    phoneValidation.disabled
  ) {
    return apiResponse.error(403, 'Verify phone first!');
  }

  const fullName = names.generateRandomName();

  //  db transaction
  const { userId, tokens } =
    (await database.db?.transaction(async (tx) => {
      // insert the user
      const user = (await database.db?.insert(users).values({ fullName }))?.[0];

      // create tokens
      const tokens = jwt.generateAuthTokens(user?.insertId as number, {
        phone,
      });

      // insert the phone details
      await tx
        .insert(phoneDetails)
        .values({ user: user?.insertId as number, phone });

      // insert the refresh token, and save the session
      await tx.insert(userSessions).values({
        user: user?.insertId as number,
        token: tokens?.refreshToken as string,
        authType: 'phone',
        userAgent: headers['user-agent']
          ? (headers['user-agent'] as string)
          : null,
      });

      return {
        userId: user?.insertId as number,
        tokens,
      };
    })) ?? {};

  // get the user to send as data in the response
  const user = (
    await database.db
      ?.select()
      .from(users)
      .where(eq(users.id, userId as number))
  )?.[0];

  // check if the user is present
  if (!user) {
    return apiResponse.serverError();
  }

  // set the cookies
  res
    .cookie('refreshToken', tokens?.refreshToken, ct.cookieOptions.auth)
    .cookie('accessToken', tokens?.accessToken, ct.cookieOptions.auth);

  // return success
  return apiResponse.res(201, 'User registered successfully!', {
    user: {
      ...user,
      phone,
    },
    tokens,
  });
};
