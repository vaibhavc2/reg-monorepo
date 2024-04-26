import { SelectUser, SelectUserSession } from '@reg/db';
import { UserData } from '@reg/types';
import { contract } from '../../contract';
import { ResponseType, apiVersionPrefix } from '../../utils';

interface Data {
  user: UserData;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

type DataWithoutPhone = {
  user: Omit<UserData, 'phone'>;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
};

const usersContract = contract.router(
  {
    'register-with-email': {
      method: 'POST',
      path: '/auth/register/email',
      responses: {
        400: ResponseType,
        403: ResponseType,
        201: contract.type<{
          status: number;
          data: Data;
          message: string;
        }>(),
        500: ResponseType,
      },
      body: contract.type<{
        email: string;
        password: string;
      }>(),
      summary: 'Register a new user using email and password.',
    },
    'login-with-email': {
      method: 'POST',
      path: '/auth/login/email',
      responses: {
        401: ResponseType,
        403: ResponseType,
        400: ResponseType,
        200: contract.type<{
          status: number;
          data: DataWithoutPhone;
          message: string;
        }>(),
      },
      body: contract.type<{
        email: string;
        password: string;
      }>(),
      summary: 'Login a new user using email and password.',
    },
    validate: {
      method: 'GET',
      path: '/validate/:credential',
      query: contract.type<{
        email?: string;
        phone?: string;
      }>(),
      pathParams: contract.type<{
        credential: 'email' | 'phone';
      }>(),
      responses: {
        200: ResponseType,
        400: ResponseType,
        403: ResponseType,
      },
      summary: 'Check if the user is valid.',
    },
    'google-oauth': {
      method: 'POST',
      path: '/oauth/google',
      query: contract.type<{
        code: string;
      }>(),
      responses: {
        200: contract.type<{
          status: number;
          data: Data;
          message: string;
        }>(),
        400: ResponseType,
        500: ResponseType,
      },
      body: contract.type<{}>(),
      summary: 'Sign up or Log in with Google OAuth.',
    },
    'register-with-phone': {
      method: 'POST',
      path: '/auth/register/phone',
      responses: {
        400: ResponseType,
        403: ResponseType,
        201: contract.type<{
          status: number;
          data: Data;
          message: string;
        }>(),
        500: ResponseType,
      },
      body: contract.type<{
        phone: string;
        password: string;
      }>(),
      summary: 'Register a new user using phone and password.',
    },
    logout: {
      method: 'POST',
      path: '/auth/logout',
      query: contract.type<{
        all?: 'true' | 'false';
      }>(),
      responses: {
        200: ResponseType,
        401: ResponseType,
        403: ResponseType,
      },
      body: contract.type<{
        sessionIds?: number[];
      }>(),
      summary: 'Logout the current user.',
    },
    'verify-email': {
      method: 'POST',
      path: '/verify/email',
      query: contract.type<{
        token: string;
        login?: 'true' | 'false';
        newUser?: 'true' | 'false';
      }>(),
      responses: {
        400: ResponseType,
        403: ResponseType,
        500: ResponseType,
        200: ResponseType,
      },
      body: contract.type<{}>(),
      summary: 'Verify user email using token.',
    },
    'send-verification-email': {
      method: 'POST',
      path: '/send/verification-email',
      query: contract.type<{
        login?: 'true' | 'false';
        newUser?: 'true' | 'false';
      }>(),
      responses: {
        200: ResponseType,
        400: ResponseType,
        403: ResponseType,
        500: ResponseType,
      },
      body: contract.type<{
        email?: string;
      }>(),
      summary: 'Send verification email to the user.',
    },
    'verify-phone-otp': {
      method: 'POST',
      path: '/verify/phone/otp',
      query: contract.type<{
        login?: 'true' | 'false';
        newUser?: 'true' | 'false';
      }>(),
      responses: {
        400: ResponseType,
        403: ResponseType,
        500: ResponseType,
        200: ResponseType,
      },
      body: contract.type<{
        otp: string;
        phone: string;
      }>(),
      summary: 'Verify user phone using OTP.',
    },
    'send-otp-to-phone': {
      method: 'POST',
      path: '/send/otp-to-phone',
      query: contract.type<{
        login?: 'true' | 'false';
        newUser?: 'true' | 'false';
      }>(),
      responses: {
        200: ResponseType,
        400: ResponseType,
        403: ResponseType,
        500: ResponseType,
      },
      body: contract.type<{
        phone: string;
      }>(),
      summary: 'Send OTP to the user phone.',
    },
    'get-user-details': {
      method: 'GET',
      path: '/me',
      responses: {
        200: contract.type<{
          status: number;
          data: {
            user: UserData;
          };
          message: string;
        }>(),
        403: ResponseType,
      },
      summary: 'Get user details.',
    },
    'get-user-sessions': {
      method: 'GET',
      path: '/me/sessions',
      responses: {
        200: contract.type<{
          status: number;
          data: {
            sessions: SelectUserSession;
          };
          message: string;
        }>(),
        401: ResponseType,
        403: ResponseType,
      },
      summary: 'Get user sessions.',
    },
    'update-name': {
      method: 'PUT',
      path: '/update/name',
      responses: {
        200: contract.type<{
          status: number;
          data: {
            user: SelectUser;
          };
          message: string;
        }>(),
        400: ResponseType,
        403: ResponseType,
        500: ResponseType,
      },
      body: contract.type<{
        fullName: string;
      }>(),
      summary: 'Update name of the user.',
    },
    'update-password': {
      method: 'PUT',
      path: '/update/password',
      responses: {
        200: contract.type<{
          status: number;
          data: {
            userId: number;
          };
          message: string;
        }>(),
        400: ResponseType,
        403: ResponseType,
        500: ResponseType,
      },
      body: contract.type<{
        password: string;
        oldPassword: string;
      }>(),
      summary: 'Update password of the user.',
    },
    'verify-invitation-link': {
      method: 'POST',
      path: '/verify/invitation-link',
      query: contract.type<{
        token: string;
      }>(),
      responses: {
        200: contract.type<{
          status: number;
          data: Data;
          message: string;
        }>(),
        400: ResponseType,
        401: ResponseType,
        403: ResponseType,
        500: ResponseType,
      },
      body: contract.type<{}>(),
      summary: 'Verify invitation link to invite a user.',
    },
    // !Protected routes: moderator
    'generate-invitation-link': {
      method: 'POST',
      path: '/generate-invitation-link',
      responses: {
        200: contract.type<{
          status: number;
          data: {
            user: UserData;
            invitationLink: string;
          };
          message: string;
        }>(),
        400: ResponseType,
        401: ResponseType,
        403: ResponseType,
        500: ResponseType,
      },
      body: contract.type<{
        fullName: string;
        phone: string;
        role: 'admin' | 'moderator' | 'user';
      }>(),
      summary: 'Generate invitation link to invite a user.',
    },
    'grant-or-revoke-access': {
      method: 'POST',
      path: '/access',
      query: contract.type<{
        grant?: 'true' | 'false';
        revoke?: 'true' | 'false';
      }>(),
      responses: {
        200: contract.type<{
          status: number;
          data: {
            user: UserData;
          };
          message: string;
        }>(),
        400: ResponseType,
        401: ResponseType,
        403: ResponseType,
        500: ResponseType,
      },
      body: contract.type<{
        userId: number;
      }>(),
      summary: 'Grant access to a user.',
    },
  },
  {
    strictStatusCodes: true,
    pathPrefix: apiVersionPrefix(1) + '/users',
    baseHeaders: contract.type<{
      Authorization?: string;
      'User-Agent'?: string;
    }>(),
  },
);

export default usersContract;
