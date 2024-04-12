import { insertSchema } from '@reg/db';
import { UserData } from '@reg/types';
import * as z from 'zod';
import { contract } from '../../contract';
import { apiVersionPrefix } from '../../utils';

const ResponseType = contract.type<{
  status: number;
  message: string;
}>();

interface Data {
  user: UserData;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

const UserContract = contract.router(
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
        400: ResponseType,
        200: ResponseType,
        500: ResponseType,
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
      responses: {
        200: ResponseType,
        400: ResponseType,
        401: ResponseType,
      },
      body: contract.type<{}>(),
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
        401: ResponseType,
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
        401: ResponseType,
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
        401: ResponseType,
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
        401: ResponseType,
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
        401: ResponseType,
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
            sessions: z.infer<typeof insertSchema.userSessions>[];
          };
          message: string;
        }>(),
        401: ResponseType,
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
            user: z.infer<typeof insertSchema.users>;
          };
          message: string;
        }>(),
        400: ResponseType,
        401: ResponseType,
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
        401: ResponseType,
        500: ResponseType,
      },
      body: contract.type<{
        password: string;
        oldPassword: string;
      }>(),
      summary: 'Update password of the user.',
    },
    'generate-invitation-link': {
      method: 'POST',
      path: '/generate-invitation-link',
      responses: {
        200: contract.type<{
          status: number;
          data: {
            user: z.infer<typeof insertSchema.users>;
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
    'verify-invitation-link': {
      method: 'POST',
      path: '/verify/invitation-link/',
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

export default UserContract;
