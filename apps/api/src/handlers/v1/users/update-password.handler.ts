import ct from '@/constants';
import { database } from '@/db';
import { apiResponse, pwd } from '@/services';
import { checkUser } from '@/utils';
import { contracts } from '@reg/contracts';
import { emailCredentials, users } from '@reg/db';
import { AppRouteImplementation } from '@ts-rest/express';
import { eq } from 'drizzle-orm';

type UpdatePassword = (typeof contracts.v1.users)['update-password'];
type UpdatePasswordHandler = AppRouteImplementation<UpdatePassword>;

export const updatePasswordHandler: UpdatePasswordHandler = async ({
  req: { user },
  body: { password, oldPassword },
}) => {
  // check if user status is valid
  if (!user || !checkUser(user)) {
    return apiResponse.error(403, 'Forbidden!');
  }

  // check if passwords are present
  if (!password || !oldPassword) {
    return apiResponse.error(400, 'Password not found!');
  }

  // check if password is valid
  if (password === oldPassword) {
    return apiResponse.error(
      400,
      'New password cannot be the same as the old password!',
    );
  }

  // start a db transaction
  const transaction = await database.db?.transaction(async (tx) => {
    // check if the old password is valid
    const credRecord = (
      await tx
        .select()
        .from(emailCredentials)
        .where(eq(emailCredentials.user, Number(user.id)))
    )?.[0];

    // check if the creds of the user are present and the password is valid
    if (
      !credRecord ||
      !(await pwd.verify(String(credRecord.password), oldPassword))
    ) {
      return { error: 'Invalid old password!' };
    }

    // update the user record
    return (await tx
      .update(emailCredentials)
      .set({
        password: String(await pwd.hash(password)),
      })
      .where(eq(users.id, Number(user.id))))
      ? { success: true }
      : { success: false };
  }, ct.dbTransactionConfig);

  if (transaction && 'error' in transaction) {
    return apiResponse.error(400, String(transaction.error));
  }

  if (
    !transaction ||
    (transaction && 'success' in transaction && !transaction.success)
  ) {
    return apiResponse.serverError();
  }

  return apiResponse.res(200, 'Password updated successfully!', {
    userId: user.id,
  });
};
