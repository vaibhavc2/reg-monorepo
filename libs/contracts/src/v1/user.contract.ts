import { UserData } from '@reg/types';
import { contract } from '../../contract';
import { apiVersionPrefix } from '../../utils';

const UserContract = contract.router(
  {
    'auth-with-email': {
      method: 'POST',
      path: '/auth/email',
      headers: contract.type<{
        'User-Agent': string;
      }>(),
      responses: {
        400: contract.type<{
          status: number;
          message: string;
        }>(),
        201: contract.type<{
          status: number;
          data: {
            user: UserData;
          };
          message: string;
        }>(),
      },
      body: contract.type<{
        fullName: string;
        email: string;
        password: string;
      }>(),
      summary: 'Register or Login a new user using email and password.',
    },
    // 'auth-with-phone': {
    //   method: 'POST',
    //   path: '/auth/phone',
    //   responses: {
    //     400: contract.type<{
    //       status: number;
    //       message: string;
    //     }>(),
    //     201: insertSchema.users
    //       .pick({ id: true, fullName: true, createdAt: true, updatedAt: true })
    //       .merge(insertSchema.phoneDetails.pick({ phone: true })),
    //     500: contract.type<{
    //       status: number;
    //       message: string;
    //     }>(),
    //   },
    //   body: contract.type<{
    //     fullName: string;
    //     phone: string;
    //     password: string;
    //   }>(),
    //   summary: 'Register or Login a new user using phone number.',
    // },
    'google-oauth': {
      method: 'POST',
      path: '/oauth/google',
      query: contract.type<{
        code: string;
      }>(),
      headers: contract.type<{
        'User-Agent': string;
      }>(),
      responses: {
        200: contract.type<{
          status: number;
          data: {
            user: UserData;
          };
          message: string;
        }>(),
        400: contract.type<{
          status: number;
          message: string;
        }>(),
      },
      body: contract.type<{}>(),
      summary: 'Sign up or Log in with Google OAuth.',
    },
    // 'verify-email': {
    //   method: 'POST',
    //   path: '/verify-email',
    //   responses: {
    //     400: contract.type<{
    //       status: number;
    //       message: string;
    //     }>(),
    //     200: contract.type<{
    //       status: number;
    //       message: string;
    //     }>(),
    //   },
    //   body: contract.type<{
    //     token: string;
    //   }>(),
    //   summary: 'Verify user email using token.',
    // },
    // 'verify-phone': {
    //   method: 'POST',
    //   path: '/verify-phone',
    //   responses: {
    //     400: contract.type<{
    //       status: number;
    //       message: string;
    //     }>(),
    //     200: contract.type<{
    //       status: number;
    //       message: string;
    //     }>(),
    //     500: contract.type<{
    //       status: number;
    //       message: string;
    //     }>(),
    //   },
    //   body: contract.type<{
    //     token: string;
    //   }>(),
    //   summary: 'Verify user phone using token.',
    // },
  },
  {
    strictStatusCodes: true,
    pathPrefix: apiVersionPrefix(1) + '/users',
  },
);

export default UserContract;
