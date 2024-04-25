import ct from '@/constants';
import { database } from '@/db';
import { apiResponse, jwt, pwd, queries } from '@/services';
import { contracts } from '@reg/contracts';
import { userSessions } from '@reg/db';
import { AppRouteImplementation } from '@ts-rest/express';

type LoginWithEmail = (typeof contracts.v1.users)['login-with-email'];
type LoginWithEmailHandler = AppRouteImplementation<LoginWithEmail>;

export const loginWithEmailHandler: LoginWithEmailHandler = async ({
  headers,
  body: { email, password },
  req: { user: loggedInUser },
  res,
}) => {
  // check if the user is already logged in
  if (loggedInUser) {
    return apiResponse.error(400, 'User already logged in!');
  }

  // verify the credentials
  const user = await queries.users.getDetailsWithPassword(email, password);

  // check if user is present and password is correct
  if (!user || !(await pwd.verify(user.password as string, password))) {
    return apiResponse.error(401, 'Invalid email or password!');
  }

  // create tokens
  const tokens = jwt.generateAuthTokens(user.id, { email: user.email });

  // insert the refresh token, and save the session
  await database.db?.insert(userSessions).values({
    user: user.id,
    token: tokens?.refreshToken as string,
    authType: 'email',
    userAgent: headers['user-agent'] ? (headers['user-agent'] as string) : null,
  });

  // set the cookies
  res
    .cookie('refreshToken', tokens.refreshToken, ct.cookieOptions.auth)
    .cookie('accessToken', tokens.accessToken, ct.cookieOptions.auth);

  // remove the password from the user object
  const { password: _, ...userWithoutPassword } = user;

  // return success
  return apiResponse.res(200, 'User logged in successfully!', {
    user: {
      ...userWithoutPassword,
    },
    tokens,
  });
};
