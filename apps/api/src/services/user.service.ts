import { database } from '@/db';
import { emailCredentials, users } from '@reg/db';
import { eq } from 'drizzle-orm';
import { MySqlRawQueryResult } from 'drizzle-orm/mysql2';

export class UserService {
  private readonly details: {
    fullName: string;
    email: string;
    password?: string;
    avatar?: string;
    cover?: string;
  };
  private googleAuth: boolean;

  constructor(
    details: {
      fullName: string;
      email: string;
      password?: string;
      avatar?: string;
      cover?: string;
    },
    googleAuth = false,
  ) {
    this.details = details;
    this.googleAuth = googleAuth;
  }

  public async upsertUser() {
    const { fullName, email, password, avatar, cover } = this.details;

    // try {
    // check if the user is already registered
    const existingUser = await database.db
      ?.select()
      .from(emailCredentials)
      .where(eq(emailCredentials.email, email));

    let emailTable: MySqlRawQueryResult | undefined;
    let usersTable: MySqlRawQueryResult | undefined;

    if (!existingUser || existingUser.length === 0) {
      // create a new user
      usersTable = await database.db?.insert(users).values({
        fullName,
        avatar,
        cover,
      });

      // create a new user credential
      if (usersTable && usersTable[0].affectedRows === 1) {
        emailTable = await database.db?.insert(emailCredentials).values({
          user: usersTable[0].insertId as number,
          email,
          password,
          googleAuth: this.googleAuth,
        });
      } else {
        return null;
      }

      // check if the user credential is created
      if (!emailTable || emailTable[0].affectedRows === 0) {
        // delete the user
        await database.db
          ?.delete(users)
          .where(eq(users.id, usersTable[0].insertId));

        return null;
      }

      return {
        userId: usersTable[0].insertId,
      };
    } else {
      // update the user
      usersTable = await database.db
        ?.update(users)
        .set({ fullName, avatar, cover })
        .where(eq(users.id, existingUser[0].user));

      return {
        userId: existingUser[0].user,
      };
    }
    // } catch (error) {
    //   throw new ApiError(500, 'Something went wrong!', error);
    // }
  }
}
