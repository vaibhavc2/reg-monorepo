import ct from '@/constants';
import { database } from '@/db';
import { apiResponse, jwt, phoneService } from '@/services';
import { contracts } from '@reg/contracts';
import {
  phoneDetails,
  phoneValidations,
  userSessions,
  verifications,
} from '@reg/db';
import { AppRouteImplementation } from '@ts-rest/express';
import { eq } from 'drizzle-orm';

type VerifyPhoneOTP = (typeof contracts.v1.UserContract)['verify-phone-otp'];
type VerifyPhoneOTPHandler = AppRouteImplementation<VerifyPhoneOTP>;

export const verifyPhoneOTPHandler: VerifyPhoneOTPHandler = async ({
  res,
  headers,
  req: { user },
  query: { login: _login, newUser: _newUser },
  body: { phone, otp },
}) => {
  const login = _login === 'true'; // verification for login using phone without password
  const newUser = _newUser === 'true'; // verification for new user

  // check if otp is present and valid (6 digits)
  if (!otp || otp.length !== 6) {
    return apiResponse.error(400, 'OTP not found!');
  }

  if (newUser) {
    // verify the otp for new user
    const response = await phoneService.verifyOTP(phone, otp);

    // check if otp was verified
    if (response.status === 'approved') {
      return apiResponse.serverError();
    }

    // get the phone validation record
    const phoneRecord = await database.db
      ?.select()
      .from(phoneValidations)
      .where(eq(phoneValidations.phone, phone));

    // check if the phone is present
    if (
      !phoneRecord ||
      !phoneRecord[0] ||
      phoneRecord[0].phone !== phone ||
      phoneRecord[0].disabled
    ) {
      return apiResponse.error(400, 'Invalid phone!');
    }

    // check if phone is already verified
    if (phoneRecord[0].verified) {
      return apiResponse.error(400, 'Phone already verified!');
    }

    // update the phone validations record
    const update = await database.db
      ?.update(phoneValidations)
      .set({
        verified: true,
      })
      .where(eq(phoneValidations.phone, phone));

    // check if phone was updated
    if (!update || !update[0].affectedRows || update[0].affectedRows !== 1) {
      return apiResponse.serverError();
    }

    // return the response
    return apiResponse.res(200, 'OTP verified successfully!');
  } else {
    // check if the user is present
    if (!user || !user.id) {
      return apiResponse.error(401, 'Unauthorized!');
    }

    // get user phone
    const creds = await database.db
      ?.select({
        phone: phoneDetails.phone,
      })
      .from(phoneDetails)
      .where(eq(phoneDetails.user, user.id));

    // check if phone is present
    if (
      !creds ||
      creds.length === 0 ||
      !creds[0].phone ||
      creds[0].phone !== phone
    ) {
      return apiResponse.error(400, 'Invalid phone!');
    }

    // verify the otp
    const response = await phoneService.verifyOTP(creds[0].phone, otp);

    // check if otp was verified
    if (response.status !== 'approved') {
      return apiResponse.serverError();
    }

    // update the user's phone verification status
    const result = await database.db
      ?.update(verifications)
      .set({
        phoneVerified: true,
      })
      .where(eq(verifications.user, user.id));

    // check if the update was successful
    if (!result || !result[0].affectedRows || result[0].affectedRows !== 1) {
      return apiResponse.serverError();
    }

    // check if the user wants to login
    if (!login) {
      // return success
      return apiResponse.res(200, 'OTP verified successfully!');
    }

    // login the user
    // get the user phone
    const phoneRes = await database.db
      ?.select({
        phone: phoneDetails.phone,
      })
      .from(phoneDetails)
      .where(eq(phoneDetails.user, user.id));

    // check if the phone is present
    if (!phoneRes || !phoneRes[0]) {
      return apiResponse.error(400, 'Invalid user!');
    }

    // create tokens
    const tokens = jwt.generateAuthTokens(user.id, {
      phone: phoneRes[0]?.phone,
    });

    // insert the refresh token, and save the session
    await database.db?.insert(userSessions).values({
      user: user.id,
      token: tokens?.refreshToken as string,
      authType: 'phone',
      userAgent: headers['user-agent']
        ? (headers['user-agent'] as string)
        : null,
    });

    // set the cookies
    res
      .cookie('refreshToken', tokens.refreshToken, ct.cookieOptions.auth)
      .cookie('accessToken', tokens.accessToken, ct.cookieOptions.auth);

    // return success
    return apiResponse.res(200, 'User logged in successfully!', {
      user: {
        ...user,
        phone: phoneRes[0]?.phone,
      },
      tokens,
    });
  }
};
