import { UserData } from '@reg/types';
import { contract } from '../../contract';
import { apiVersionPrefix } from '../../utils';

const ResponseType = contract.type<{
  status: number;
  message: string;
}>();

const UserContract = contract.router(
  {
    'register-with-email': {
      method: 'POST',
      path: '/auth/email/register',
      responses: {
        400: ResponseType,
        201: contract.type<{
          status: number;
          data: {
            user: UserData;
          };
          message: string;
        }>(),
        500: ResponseType,
      },
      body: contract.type<{
        fullName: string;
        email: string;
        password: string;
      }>(),
      summary: 'Register a new user using email and password.',
    },
    'login-with-email': {
      method: 'POST',
      path: '/auth/email/login',
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
    'google-oauth': {
      method: 'POST',
      path: '/oauth/google',
      query: contract.type<{
        code: string;
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
        500: ResponseType,
      },
      body: contract.type<{}>(),
      summary: 'Sign up or Log in with Google OAuth.',
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
    'verify-email': {
      method: 'POST',
      path: '/verify-email',
      query: contract.type<{
        token: string;
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
      path: '/send-verification-email',
      responses: {
        200: ResponseType,
        400: ResponseType,
        401: ResponseType,
        500: ResponseType,
      },
      body: contract.type<{}>(),
      summary: 'Send verification email to the user.',
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
