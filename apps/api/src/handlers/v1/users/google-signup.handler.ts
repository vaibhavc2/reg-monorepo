import { db } from '@/db';
import { google } from '@/services';
import { printErrorMessage } from '@/utils';
import { contracts } from '@reg/contracts';
import { emailCredentials, userSessions, users, verifications } from '@reg/db';
import { AppRouteImplementation } from '@ts-rest/express';
import { eq } from 'drizzle-orm';
import { MySqlRawQueryResult } from 'drizzle-orm/mysql2';

type GoogleSignup = (typeof contracts.v1.UserContract)['google-signup'];
type GoogleSignupHandler = AppRouteImplementation<GoogleSignup>;

export const googleSignupHandler: GoogleSignupHandler = async ({
  query: { code },
}) => {
  try {
    // get tokens from the code
    const tokens = await google.getTokens(code);

    // check if the refresh token is present
    if (!tokens?.refresh_token) {
      return {
        status: 400 as 400,
        body: {
          status: 400,
          message: 'Invalid user!',
        },
      };
    }

    // get user info from the access token
    const user = await google.getUser(String(tokens?.access_token));

    // validate the details of the user
    if (!user?.email || !user?.name || !user?.picture) {
      return {
        status: 400 as 400,
        body: {
          status: 400,
          message: 'Invalid user!',
        },
      };
    }

    // check if the user is already registered
    const existingUser = await db
      ?.select()
      .from(emailCredentials)
      .where(eq(emailCredentials.email, user?.email as string));

    if (existingUser) {
      return {
        status: 400 as 400,
        body: {
          status: 400,
          message: 'User already exists',
        },
      };
    }

    // create a new user
    const usersTable = await db?.insert(users).values({
      fullName: user?.name as string,
      cover: user?.picture as string,
    });

    // create a new user credential
    let emailTable: MySqlRawQueryResult | undefined;
    if (usersTable && usersTable[0].affectedRows === 1) {
      emailTable = await db?.insert(emailCredentials).values({
        user: usersTable[0].insertId as number,
        email: user?.email as string,
        googleAuth: true,
      });
    } else {
      return {
        status: 500 as 500,
        body: {
          status: 500,
          message: 'Internal Server Error!',
        },
      };
    }

    // check if the user credential is created
    if (!emailTable || emailTable[0].affectedRows === 0) {
      // delete the user
      await db?.delete(users).where(eq(users.id, usersTable[0].insertId));

      return {
        status: 500 as 500,
        body: {
          status: 500,
          message: 'Internal Server Error!',
        },
      };
    }

    // insert the refresh token, and save the session
    const sessionsTable = await db?.insert(userSessions).values({
      user: usersTable[0].insertId as number,
      token: tokens?.refresh_token as string,
      authType: 'google',
    });

    // check if the session is created
    if (!sessionsTable || sessionsTable[0].affectedRows === 0) {
      // delete the user
      await db?.delete(users).where(eq(users.id, usersTable[0].insertId));

      // delete the user credential
      await db
        ?.delete(emailCredentials)
        .where(eq(emailCredentials.user, emailTable[0].insertId));

      return {
        status: 500 as 500,
        body: {
          status: 500,
          message: 'Internal Server Error!',
        },
      };
    }

    // save verification record of the user
    const verificationsTable = await db?.insert(verifications).values({
      user: usersTable[0].insertId as number,
      emailVerified: true,
    });

    // check if the verification record is created
    if (!verificationsTable || verificationsTable[0].affectedRows === 0) {
      // delete the user
      await db?.delete(users).where(eq(users.id, usersTable[0].insertId));

      // delete the user credential
      await db
        ?.delete(emailCredentials)
        .where(eq(emailCredentials.user, emailTable[0].insertId));

      // delete the session
      await db
        ?.delete(userSessions)
        .where(eq(userSessions.id, sessionsTable[0].insertId));

      return {
        status: 500 as 500,
        body: {
          status: 500,
          message: 'Internal Server Error!',
        },
      };
    }

    // return success
    return {
      status: 200 as 200,
      body: {
        status: 200,
        message: 'User signed up successfully',
      },
    };
  } catch (error) {
    printErrorMessage(error, 'google signup()');
    return {
      status: 400 as 400,
      body: {
        status: 400,
        message: 'Error! Please try again.',
      },
    };
  }
};
