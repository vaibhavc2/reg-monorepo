import { database } from '@/db';
import { PreparedQueryType } from '@/types';
import { SelectUser, emailCredentials, phoneDetails, users } from '@reg/db';
import {
  QueryUserData,
  QueryUserWithEmail,
  QueryUserWithPassword,
  QueryUserWithPhone,
} from '@reg/types';
import { eq, sql } from 'drizzle-orm';

class UserQueries {
  private readonly queries: {
    getUser: PreparedQueryType<SelectUser>;
    getDetails: PreparedQueryType<QueryUserData>;
    getDetailsWithEmail: PreparedQueryType<QueryUserWithEmail>;
    getDetailsWithPhone: PreparedQueryType<QueryUserWithPhone>;
    getDetailsWithPassword: PreparedQueryType<QueryUserWithPassword>;
  };

  constructor() {
    this.queries = {
      getUser: database.db?.query.users
        .findFirst({
          where: eq(users.id, sql.placeholder('id')),
        })
        .prepare() as PreparedQueryType<SelectUser>,
      getDetails: database.db?.query.users
        .findFirst({
          where: eq(users.id, sql.placeholder('id')),
          with: {
            emailCredentials: {
              columns: {
                email: true,
              },
              where: eq(emailCredentials.user, sql.placeholder('id')),
            },
            phoneDetails: {
              columns: {
                phone: true,
              },
              where: eq(phoneDetails.user, sql.placeholder('id')),
            },
          },
        })
        .prepare() as PreparedQueryType<QueryUserData>,
      getDetailsWithEmail: database.db?.query.users
        .findFirst({
          where: eq(users.id, sql.placeholder('id')),
          with: {
            emailCredentials: {
              columns: {
                email: true,
              },
              where: eq(emailCredentials.user, sql.placeholder('id')),
            },
          },
        })
        .prepare() as PreparedQueryType<QueryUserWithEmail>,
      getDetailsWithPhone: database.db?.query.users
        .findFirst({
          where: eq(users.id, sql.placeholder('id')),
          with: {
            phoneDetails: {
              columns: {
                phone: true,
              },
              where: eq(phoneDetails.user, sql.placeholder('id')),
            },
          },
        })
        .prepare() as PreparedQueryType<QueryUserWithPhone>,
      getDetailsWithPassword: database.db?.query.emailCredentials
        .findFirst({
          columns: {
            email: true,
            password: true,
          },
          where: eq(emailCredentials.email, sql.placeholder('email')),
          with: {
            user: {
              where: eq(users.id, emailCredentials.user),
            },
          },
        })
        .prepare() as PreparedQueryType<QueryUserWithPassword>,
    };
  }

  async getUser(id: number) {
    return await this.queries.getUser?.execute({ id });
  }

  async getDetails(id: number) {
    const result = await this.queries.getDetails?.execute({ id });

    if (result) {
      const { emailCredentials, phoneDetails, ...otherDetails } = result;
      return {
        ...otherDetails,
        email: emailCredentials?.email,
        phone: phoneDetails?.phone,
      };
    }
  }

  async getDetailsWithEmail(id: number) {
    const result = await this.queries.getDetailsWithEmail?.execute({ id });

    if (result) {
      const { emailCredentials, ...otherDetails } = result;
      return {
        ...otherDetails,
        email: emailCredentials?.email,
      };
    }
  }

  async getDetailsWithPhone(id: number) {
    const result = await this.queries.getDetailsWithPhone?.execute({ id });

    if (result) {
      const { phoneDetails, ...otherDetails } = result;
      return {
        ...otherDetails,
        phone: phoneDetails?.phone,
      };
    }
  }

  async getDetailsWithPassword(email: string, password: string) {
    const result = await this.queries.getDetailsWithPassword?.execute({
      email,
    });

    if (result) {
      const { user, ...creds } = result;
      return {
        ...user,
        email: creds?.email,
        password: creds?.password,
      };
    }
  }
}

export const userQueries = new UserQueries();
