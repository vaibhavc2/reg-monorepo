import { database } from '@/db';
import { emailCredentials, users, verifications } from '@reg/db';
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

  public async insertUser() {
    // check if the user is registered with google
    if (this.googleAuth) {
      // upsert the user using google auth details
      return await this.upsertGoogleUser();
    }

    const { fullName, email, password } = this.details;

    // create a new user
    const usersTable = await database.db?.insert(users).values({
      fullName,
    });

    if (!usersTable || usersTable[0].affectedRows !== 1) return null;

    const emailTable = await database.db?.insert(emailCredentials).values({
      user: usersTable[0].insertId as number,
      email,
      password,
    });

    if (!emailTable || emailTable[0].affectedRows === 0) {
      // delete the user
      await database.db
        ?.delete(users)
        .where(eq(users.id, usersTable[0].insertId));
    }

    // save verification record of the user
    await database.db?.insert(verifications).values({
      user: usersTable[0].insertId as number,
    });

    return {
      userId: usersTable[0].insertId,
    };
  }

  public async upsertGoogleUser() {
    const { fullName, email, password, avatar, cover } = this.details;

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

      if (!usersTable || usersTable[0].affectedRows !== 1) return null;

      // create a new user credential
      emailTable = await database.db?.insert(emailCredentials).values({
        user: usersTable[0].insertId as number,
        email,
        password,
        googleAuth: this.googleAuth,
      });

      // save verification record of the user
      await database.db?.insert(verifications).values({
        user: usersTable[0].insertId as number,
        emailVerified: true,
      });

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
  }
}
