import ct from '@/constants';
import { database } from '@/db';
import { apiResponse, jwt } from '@/services';
import { contracts } from '@reg/contracts';
import { phoneDetails, userSessions, users } from '@reg/db';
import { AppRouteImplementation } from '@ts-rest/express';
import { eq } from 'drizzle-orm';

type VerifyInvitationLink =
  (typeof contracts.v1.UserContract)['verify-invitation-link'];
type VerifyInvitationLinkHandler = AppRouteImplementation<VerifyInvitationLink>;

export const verifyInvitationLinkHandler: VerifyInvitationLinkHandler = async ({
  res,
  headers,
  query: { token },
}) => {
  // check if the token is present
  if (!token) {
    return apiResponse.error(400, 'Token not found!');
  }

  // verify the invitation link
  const { id, phone } = jwt.verifyVerificationToken(token) ?? {};

  // check if the invitation link was verified
  if (!id || !phone) {
    return apiResponse.error(400, 'Invalid invitation!');
  }

  // check if the user is already verified
  const existingUser = (
    await database.db
      ?.select()
      .from(users)
      .where(eq(users.id, Number(id)))
  )?.[0];

  // check if the user is present
  if (!existingUser) {
    return apiResponse.error(400, 'Invalid Token!');
  }

  // check if the user is already verified
  if (existingUser.status === 'active') {
    return apiResponse.error(400, 'User already verified!');
  }

  // start db transaction
  const { user, tokens } =
    (await database.db?.transaction(async (tx) => {
      // add the phone details
      await tx.insert(phoneDetails).values({
        user: id,
        phone,
      });

      // update the user status to 'active'
      await tx
        .update(users)
        .set({
          status: 'active',
        })
        .where(eq(users.id, Number(id)));

      // generate the access token and refresh token
      const tokens = jwt.generateAuthTokens(id, {
        phone,
      });

      // insert the refresh token, and save the session
      await tx.insert(userSessions).values({
        user: id,
        token: tokens?.refreshToken,
        authType: 'phone',
        userAgent: headers['user-agent']
          ? (headers['user-agent'] as string)
          : null,
      });

      const user = await tx.select().from(users).where(eq(users.id, id));

      return {
        user,
        tokens,
      };
    }, ct.dbTransactionConfig)) ?? {};

  // set the cookies
  res
    .cookie('refreshToken', tokens?.refreshToken, ct.cookieOptions.auth)
    .cookie('accessToken', tokens?.accessToken, ct.cookieOptions.auth);

  return apiResponse.res(
    200,
    'Invitation link verified successfully! You are now logged in!',
    {
      user: {
        ...user,
        phone,
      },
      tokens,
    },
  );
};
