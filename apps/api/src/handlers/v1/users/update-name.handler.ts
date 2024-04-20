import { database } from '@/db';
import { apiResponse, queries } from '@/services';
import { contracts } from '@reg/contracts';
import { users } from '@reg/db';
import { AppRouteImplementation } from '@ts-rest/express';
import { eq } from 'drizzle-orm';

type UpdateName = (typeof contracts.v1.UsersContract)['update-name'];
type UpdateNameHandler = AppRouteImplementation<UpdateName>;

export const updateNameHandler: UpdateNameHandler = async ({
  req: { user },
  body: { fullName },
}) => {
  // check if user is present
  if (!user) {
    return apiResponse.error(401, 'Unauthorized!');
  }

  // check if fullName is present
  if (!fullName) {
    return apiResponse.error(400, 'Full name not found!');
  }

  // update the user record
  const update = await database.db
    ?.update(users)
    .set({
      fullName,
    })
    .where(eq(users.id, user?.id));

  // check if user record was updated
  if (
    !update ||
    !update[0].affectedRows ||
    update[0].affectedRows !== 1 ||
    update[0].insertId !== user.id
  ) {
    return apiResponse.serverError();
  }

  // get the updated user record
  const updatedUser = await queries.users.getUser(user.id);

  // check if updated user record was found
  if (!updatedUser) {
    return apiResponse.serverError();
  }

  return apiResponse.res(200, 'Name updated successfully!', {
    user: updatedUser,
  });
};
