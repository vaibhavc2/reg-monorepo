import { database } from '@/db';
import { apiResponse, pwd } from '@/services';
import { contracts } from '@reg/contracts';
import { emailCredentials, users } from '@reg/db';
import { AppRouteImplementation } from '@ts-rest/express';
import { eq } from 'drizzle-orm';

type UpdatePassword = (typeof contracts.v1.UserContract)['update-password'];
type UpdatePasswordHandler = AppRouteImplementation<UpdatePassword>;

export const updatePasswordHandler: UpdatePasswordHandler = async ({
  req: { user },
  body: { password, oldPassword },
}) => {
  // check if user is present
  if (!user || !user.id) {
    return apiResponse.error(401, 'Unauthorized!');
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

  // check if the old password is valid
  const credRecord = (
    await database.db
      ?.select()
      .from(emailCredentials)
      .where(eq(emailCredentials.user, user.id))
  )?.[0];

  // check if the creds of the user are present
  if (!credRecord) {
    return apiResponse.error(400, 'Invalid user!');
  }

  // check if the old password is valid
  const truePassword = await pwd.verify(
    String(credRecord.password),
    oldPassword,
  );

  if (!truePassword) {
    return apiResponse.error(400, 'Invalid old password!');
  }

  // hash the new password
  const newPassword = (await pwd.hash(password)) as string;

  // update the user record
  const update = await database.db
    ?.update(emailCredentials)
    .set({
      password: newPassword,
    })
    .where(eq(users.id, user.id));

  // check if user record was updated
  if (
    !update ||
    !update[0].affectedRows ||
    update[0].affectedRows !== 1 ||
    update[0].insertId !== user.id
  ) {
    return apiResponse.serverError();
  }

  return apiResponse.res(200, 'Password updated successfully!', {
    userId: user.id,
  });
};
