// import { insertSchema } from '@reg/db';
import { contract } from '../contract';
import { apiVersionPrefix } from '../utils';

const UserContract = contract.router(
  {
    // 'register-with-email': {
    //   method: 'POST',
    //   path: '/register',
    //   responses: {
    //     400: contract.type<{
    //       status: number;
    //       message: string;
    //     }>(),
    //     201: insertSchema.users
    //       .pick({ id: true, fullName: true, createdAt: true, updatedAt: true })
    //       .merge(insertSchema.emailCredentials.pick({ email: true })),
    //     500: contract.type<{
    //       status: number;
    //       message: string;
    //     }>(),
    //   },
    //   body: contract.type<{
    //     fullName: string;
    //     email: string;
    //     password: string;
    //   }>(),
    //   summary: 'Register a new user using email and password.',
    // },
    // 'register-with-phone': {
    //   method: 'POST',
    //   path: '/register-phone',
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
    //   summary: 'Register a new user using phone number.',
    // },
    'google-signup': {
      method: 'POST',
      path: '/oauth/google/signup',
      query: contract.type<{
        code: string;
      }>(),
      responses: {
        200: contract.type<{
          status: number;
          message: string;
        }>(),
        400: contract.type<{
          status: number;
          message: string;
        }>(),
        500: contract.type<{
          status: number;
          message: string;
        }>(),
      },
      body: contract.type<{}>(),
      summary: 'Sign up with Google OAuth',
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
    //     500: contract.type<{
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
    'device-details': {
      method: 'POST',
      path: '/device-details',
      responses: {
        400: contract.type<{
          status: number;
          message: string;
        }>(),
        200: contract.type<{
          status: number;
          message: string;
        }>(),
        500: contract.type<{
          status: number;
          message: string;
        }>(),
      },
      body: contract.type<{
        deviceName: string;
        deviceOs: string;
        deviceOsVersion: string;
        deviceType: string;
        deviceManufacturer: string;
        deviceModel: string;
      }>(),
      summary: 'Save device details.',
    },
  },
  {
    strictStatusCodes: true,
    pathPrefix: apiVersionPrefix(1) + '/users',
  },
);

export default UserContract;
