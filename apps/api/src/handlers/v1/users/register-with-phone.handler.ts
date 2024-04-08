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
  const existingUser = await database.db
    ?.select()
    .from(phoneDetails)
    .where(eq(phoneDetails.phone, phone));

  if (existingUser && existingUser.length > 0) {
    return apiResponse.error(400, 'User already exists!');
  }

  // check if the phone is verified earlier
  const phoneValidation = await database.db
    ?.select()
    .from(phoneValidations)
    .where(eq(phoneValidations.phone, phone));

  if (
    !phoneValidation ||
    phoneValidation.length === 0 ||
    !phoneValidation[0].verified ||
    phoneValidation[0].disabled
  ) {
    return apiResponse.error(403, 'Verify phone first!');
  }

  const fullName = names.generateUniqueName();

  // insert the user
  const userResponse = await database.db?.insert(users).values({ fullName });

  // verify the inserted user
  if (
    !userResponse ||
    userResponse[0].affectedRows ||
    !userResponse[0].insertId
  ) {
    return apiResponse.serverError();
  }

  const userId = userResponse[0].insertId;

  //? create tokens to login immediately after registration
  // create tokens
  const tokens = jwt.generateAuthTokens(userId, { phone });

  // insert the refresh token, and save the session
  await database.db?.insert(userSessions).values({
    user: userId,
    token: tokens?.refreshToken as string,
    authType: 'phone',
    userAgent: headers['user-agent'] ? (headers['user-agent'] as string) : null,
  });

  // get the user to send as data in the response
  let user = await database.db
    ?.select()
    .from(users)
    .where(eq(users.id, userId));

  // check if the user is present
  if (!user || user.length === 0) {
    return apiResponse.serverError();
  }

  // set the cookies
  res
    .cookie('refreshToken', tokens.refreshToken, ct.cookieOptions.auth)
    .cookie('accessToken', tokens.accessToken, ct.cookieOptions.auth);

  // return success
  return apiResponse.res(201, 'User registered successfully!', {
    user: {
      ...user[0],
      phone,
    },
    tokens,
  });
};
