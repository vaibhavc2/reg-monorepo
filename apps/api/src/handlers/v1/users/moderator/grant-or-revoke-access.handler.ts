import ct from '@/constants';
import { database } from '@/db';
import { apiResponse, queries } from '@/services';
import { contracts } from '@reg/contracts';
import { verifications } from '@reg/db';
import { AppRouteImplementation } from '@ts-rest/express';
import { eq } from 'drizzle-orm';

type GrantOrRevokeAccess =
  (typeof contracts.v1.UsersContract)['grant-or-revoke-access'];
type GrantOrRevokeAccessHandler = AppRouteImplementation<GrantOrRevokeAccess>;

export const grantOrRevokeAccessHandler: GrantOrRevokeAccessHandler = async ({
  req: { user: mainUser },
  body: { userId },
  query: { grant: _grant, revoke: _revoke },
}) => {
  // check if the user is present
  if (!mainUser) {
    return apiResponse.error(401, 'Unauthorized!');
  }

  // check if the user is an admin or moderator
  if (mainUser.role !== 'admin' && mainUser.role !== 'moderator') {
    return apiResponse.error(403, 'Forbidden!');
  }

  const grant = _grant === 'true' ? true : false;
  const revoke = _revoke === 'true' ? true : false;

  // check if grant and revoke both are not present
  if ((!grant && !revoke) || (grant && revoke)) {
    return apiResponse.error(400, 'Invalid request!');
  }

  // status: true means access granted, false means access revoked
  const status = grant && !revoke ? true : false;

  // find and update the user
  const { message, user, err } =
    (await database.db?.transaction(async (trx) => {
      // get the user
      const user = await queries.users.getUser(userId);

      if (!user)
        return {
          message: 'Invalid user ID!',
        };

      // a moderator can't change for an admin
      if (mainUser.role === 'moderator') {
        if (user?.role === 'admin') {
          return { err: apiResponse.error(403, 'Forbidden!') };
        }
      }

      // check if the user is active
      if (user.status !== 'active')
        return {
          message:
            'User account is not activated! Activate your account first!',
        };

      // update the verification record
      await trx
        .update(verifications)
        .set({
          status, // status: true means access granted, false means access revoked
        })
        .where(eq(verifications.user, userId));

      return {
        user,
      };
    }, ct.dbTransactionConfig)) ?? {};

  if (err) return err;

  // check if the user is not found
  if (!user || message) {
    return apiResponse.error(400, message ?? 'User not found!');
  }

  // return success
  return apiResponse.res(200, 'Access granted to the user successfully!', {
    user: {
      userId,
    },
    verification: {
      status: true,
    },
  });
};
