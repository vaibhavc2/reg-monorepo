import { database } from '@/db';
import { apiResponse, phoneService } from '@/services';
import { contracts } from '@reg/contracts';
import { phoneDetails, phoneValidations } from '@reg/db';
import { AppRouteImplementation } from '@ts-rest/express';
import { eq } from 'drizzle-orm';

type SendOTPToPhone = (typeof contracts.v1.UsersContract)['send-otp-to-phone'];
type SendOTPToPhoneHandler = AppRouteImplementation<SendOTPToPhone>;

export const sendOTPToPhoneHandler: SendOTPToPhoneHandler = async ({
  req: { user },
  query: { login: _login, newUser: _newUser },
  body: { phone },
}) => {
  const login = _login === 'true'; // verification for login using phone without password
  const newUser = _newUser === 'true'; // verification for new user

  if (!phone) {
    return apiResponse.error(400, 'Phone not found!');
  }

  if (newUser) {
    // send the verification otp for new user
    const response = await phoneService.sendOTP(phone);

    // check if otp was sent
    if (response.status === 'pending') {
      return apiResponse.serverError();
    }

    // save the phone to the phone validations record
    const phoneRecord = await database.db?.insert(phoneValidations).values({
      phone,
    });

    // check if the phone was saved
    if (!phoneRecord) {
      return apiResponse.serverError();
    }
  } else {
    if (!login) {
      // check if the user is present
      if (!user) {
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

      // send the otp
      const response = await phoneService.sendOTP(creds[0].phone);

      // check if email was sent
      if (!response) {
        return apiResponse.serverError();
      }
    } else {
      // send the verification email for login
      const response = await phoneService.sendOTP(phone);

      // check if email was sent
      if (!response) {
        return apiResponse.serverError();
      }
    }
  }

  // send success response
  return apiResponse.res(200, 'OTP sent successfully!');
};
