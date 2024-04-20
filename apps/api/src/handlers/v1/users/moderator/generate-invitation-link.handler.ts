import ct from '@/constants';
import { database } from '@/db';
import { apiResponse, jwt, names } from '@/services';
import { contracts } from '@reg/contracts';
import { phoneDetails, users } from '@reg/db';
import { AppRouteImplementation } from '@ts-rest/express';
import { eq } from 'drizzle-orm';
import { isValidPhoneNumber } from 'libphonenumber-js';

type GenerateInvitationLink =
  (typeof contracts.v1.UsersContract)['generate-invitation-link'];
type GenerateInvitationLinkHandler =
  AppRouteImplementation<GenerateInvitationLink>;

export const generateInvitationLinkHandler: GenerateInvitationLinkHandler =
  async ({ req: { user }, body: { fullName, phone, role } }) => {
    if (!user) {
      return apiResponse.error(401, 'Unauthorized!');
    }

    // validate the role
    if (role !== 'admin' && role !== 'moderator' && role !== 'user') {
      return apiResponse.error(400, 'Invalid role!');
    }

    // check user.role to validate if the user is an admin or moderator
    // a moderator can generate invitation link for a user or a moderator and admin can generate invitation link for a user, moderator or an admin
    if (
      user.role === 'user' ||
      (user.role === 'moderator' && role === 'admin')
    ) {
      return apiResponse.error(403, 'Forbidden!');
    }

    // validate the phone number: only Indian numbers are allowed
    // input phone number should be in the format: +91XXXXXXXXXX i.e. e164 format
    if (!isValidPhoneNumber(phone, 'IN')) {
      return apiResponse.error(400, 'Invalid phone number!');
    }

    // check if phone is already registered
    const phoneRecord = (
      await database.db
        ?.select()
        .from(phoneDetails)
        .where(eq(phoneDetails.phone, phone))
    )?.[0];

    if (phoneRecord) {
      return apiResponse.error(400, 'User with same Phone number exists!');
    }

    // insert a user for the invitation link to work
    // user can be inserted with the role provided in the params
    // user can be inserted with the status as 'pending'
    const newUser = (
      await database.db?.insert(users).values({
        fullName: fullName || names.generateRandomName(),
        role,
        status: 'pending',
      })
    )?.[0];

    if (!newUser?.insertId) {
      return apiResponse.error(500, 'Failed to generate invitation link!');
    }

    // generate verification token
    const token = jwt.generateVerificationToken({
      userId: newUser.insertId,
      phone,
    });

    // generate the invitation link
    const invitationLink = `${ct.base_url}${contracts.v1.UsersContract['verify-invitation-link'].path}/${role}/?token=${token}`;

    return apiResponse.res(200, 'Invitation link generated successfully!', {
      user: {
        ...newUser,
        phone,
      },
      invitationLink,
    });
  };
