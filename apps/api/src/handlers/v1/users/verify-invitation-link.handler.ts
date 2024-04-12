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
  const user = (
    await database.db
      ?.select()
      .from(users)
      .where(eq(users.id, Number(id)))
  )?.[0];

  // check if the user is present
  if (!user) {
    return apiResponse.error(400, 'Invalid Token!');
  }

  // check if the user is already verified
  if (user.status === 'active') {
    return apiResponse.error(400, 'User already verified!');
  }

  // add the phone details
  const phoneResponse = await database.db?.insert(phoneDetails).values({
    user: id,
    phone,
  });

  // check if the phone was added
  if (!phoneResponse?.[0]?.insertId) {
    return apiResponse.error(500, 'Failed to verify invitation link!');
  }
  // update the user status to 'active'
  const userResponse = await database.db
    ?.update(users)
    .set({
      status: 'active',
    })
    .where(eq(users.id, Number(id)));

  // check if the user was updated
  if (!userResponse?.[0]?.affectedRows || userResponse[0].affectedRows !== 1) {
    // delete the phone credentials
    await database.db?.delete(phoneDetails).where(eq(phoneDetails.user, id));

    return apiResponse.error(500, 'Failed to verify invitation link!');
  }

  // login the user
  // gemerate the access token and refresh token
  const { accessToken, refreshToken } = jwt.generateAuthTokens(id, {
    phone,
  });

  // insert the refresh token, and save the session
  await database.db?.insert(userSessions).values({
    user: id,
    token: refreshToken,
    authType: 'phone',
    userAgent: headers['user-agent'] ? (headers['user-agent'] as string) : null,
  });

  // set the cookies
  res
    .cookie('refreshToken', refreshToken, ct.cookieOptions.auth)
    .cookie('accessToken', accessToken, ct.cookieOptions.auth);

  return apiResponse.res(
    200,
    'Invitation link verified successfully! You are now logged in!',
    {
      user: {
        ...user,
        phone,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    },
  );
};
