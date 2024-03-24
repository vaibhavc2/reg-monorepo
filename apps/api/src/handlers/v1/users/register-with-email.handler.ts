import { db } from '@/db';
import { contracts } from '@reg/contracts';
import { emailCredentials, users } from '@reg/db';
import { AppRouteImplementation } from '@ts-rest/express';
import { eq } from 'drizzle-orm';

type RegisterWithEmail =
  (typeof contracts.v1.UserContract)['register-with-email'];
type RegisterWithEmailHandler = AppRouteImplementation<RegisterWithEmail>;

export const registerWithEmailHandler: RegisterWithEmailHandler = async ({
  body: { fullName, email, password },
}) => {
  // validation using middleware
  // check if the email is already registered
  const existingUser = await db
    ?.select()
    .from(emailCredentials)
    .where(eq(emailCredentials.email, email));

  // check if the user is already registered
  if (existingUser) {
    return {
      status: 400 as 400,
      body: {
        status: 400,
        message: 'User already exists! Please login.',
      },
    };
  }

  // save the user details
  const usersTable = await db?.insert(users).values({
    fullName,
  });

  // check if the user details are saved
  if (!usersTable || usersTable[0].affectedRows === 0) {
    return {
      status: 500 as 500,
      body: {
        status: 500,
        message: 'Internal Server Error!',
      },
    };
  }

  // save the email credentials
  const emailCredentialsTable = await db?.insert(emailCredentials).values({
    user: usersTable[0].insertId,
    email,
    password,
  });

  // check if the email credentials are saved
  if (!emailCredentialsTable || emailCredentialsTable[0].affectedRows === 0) {
    // delete the user details
    await db?.delete(users).where(eq(users.id, usersTable[0].insertId));

    return {
      status: 500 as 500,
      body: {
        status: 500,
        message: 'Internal Server Error!',
      },
    };
  }

  let user = await db
    ?.select()
    .from(users)
    .where(eq(users.id, usersTable[0].insertId));

  const emailCredential = await db
    ?.select()
    .from(emailCredentials)
    .where(eq(emailCredentials.user, emailCredentialsTable[0].insertId));

  // check if the user and email credential are saved
  if (!user || !emailCredential) {
    // delete the user details
    await db?.delete(users).where(eq(users.id, usersTable[0].insertId));
    // delete the email credentials
    await db
      ?.delete(emailCredentials)
      .where(eq(emailCredentials.id, emailCredentialsTable[0].insertId));

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
    status: 201 as 201,
    body: {
      status: 201,
      data: {
        ...user[0],
        email: emailCredential[0].email,
      },
      message: 'User registered successfully!',
    },
  };
};
