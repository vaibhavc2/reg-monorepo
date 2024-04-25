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

type VerifyPhoneOTP = (typeof contracts.v1.users)['verify-phone-otp'];
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
    if (!user) {
      return apiResponse.error(401, 'Unauthorized!');
    }

    // get user phone
    const creds = (
      await database.db
        ?.select({
          phone: phoneDetails.phone,
        })
        .from(phoneDetails)
        .where(eq(phoneDetails.user, user.id))
    )?.[0];

    // check if phone is present
    if (!creds || !creds.phone || creds.phone !== phone) {
      return apiResponse.error(400, 'Invalid phone!');
    }

    // verify the otp
    const response = await phoneService.verifyOTP(creds.phone, otp);

    // check if otp was verified
    if (response.status !== 'approved') {
      return apiResponse.serverError();
    }

    const userId = user.id;

    // start db transaction
    const { message, tokens } =
      (await database.db?.transaction(async (tx) => {
        // update the user's phone verification status
        await tx
          .update(verifications)
          .set({
            phoneVerified: true,
          })
          .where(eq(verifications.user, userId));

        // check if the user wants to login
        if (!login) return { message: 'OTP verified successfully!' };

        // login the user
        // get the user phone
        const phoneRecord = (
          await tx
            .select({
              phone: phoneDetails.phone,
            })
            .from(phoneDetails)
            .where(eq(phoneDetails.user, userId))
        )?.[0];

        // create tokens
        const tokens = jwt.generateAuthTokens(userId, {
          phone: phoneRecord?.phone,
        });

        // insert the refresh token, and save the session
        await tx.insert(userSessions).values({
          user: userId,
          token: tokens?.refreshToken as string,
          authType: 'phone',
          userAgent: headers['user-agent']
            ? (headers['user-agent'] as string)
            : null,
        });

        return { tokens };
      })) ?? {};

    if (message) return apiResponse.res(200, message);

    // set the cookies
    res
      .cookie('refreshToken', tokens?.refreshToken, ct.cookieOptions.auth)
      .cookie('accessToken', tokens?.accessToken, ct.cookieOptions.auth);

    // return success
    return apiResponse.res(200, 'User logged in successfully!', {
      user: {
        ...user,
        phone,
      },
      tokens,
    });
  }
};
