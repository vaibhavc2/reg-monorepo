import ct from '@/constants';
import { database } from '@/db';
import { apiResponse, jwt, names } from '@/services';
import { contracts } from '@reg/contracts';
import { users } from '@reg/db';
import { AppRouteImplementation } from '@ts-rest/express';

type GenerateInvitationLink =
  (typeof contracts.v1.UserContract)['generate-invitation-link'];
type GenerateInvitationLinkHandler =
  AppRouteImplementation<GenerateInvitationLink>;

export const generateInvitationLinkHandler: GenerateInvitationLinkHandler =
  async ({ req: { user }, body: { fullName, phone, role } }) => {
    if (!user || !user.id) {
      return apiResponse.error(401, 'Unauthorized!');
    }

    // validate the role
    if (role !== 'admin' && role !== 'moderator' && role !== 'user') {
      return apiResponse.error(400, 'Invalid role!');
    }

    // check user.role to validate if the user is an admin or moderator
    // user can only generate invitation link for a user, moderator can generate invitation link for a user or a moderator and admin can generate invitation link for a user, moderator or an admin
    if (user.role === 'user' && role !== 'user') {
      return apiResponse.error(403, 'Forbidden!');
    } else if (user.role === 'moderator' && role === 'admin') {
      return apiResponse.error(403, 'Forbidden!');
    }

    // insert a user for the invitation link to work
    // user can be inserted with the role provided in the params
    // user can be inserted with the status as 'pending'
    const userResponse = await database.db?.insert(users).values({
      fullName: fullName || names.generateRandomName(),
      role,
      status: 'pending',
    });

    if (!userResponse?.[0]?.insertId) {
      return apiResponse.error(500, 'Failed to generate invitation link!');
    }

    // generate verification token
    const token = jwt.generateVerificationToken({
      userId: userResponse[0].insertId,
      phone,
    });

    // generate the invitation link
    const invitationLink = `${ct.base_url}${contracts.v1.UserContract['verify-invitation-link'].path}/${role}/?token=${token}`;

    return apiResponse.res(200, 'Invitation link generated successfully!', {
      user: userResponse[0],
      invitationLink,
    });
  };
