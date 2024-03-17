import { contract } from '../contract';

const GoogleOAuthContract = contract.router(
  {
    signup: {
      method: 'POST',
      path: 'signup/oauth/google',
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
      },
      body: contract.type<{}>(),
      summary: 'Sign up with Google OAuth',
    },
  },
  {
    strictStatusCodes: true,
  },
);

export default GoogleOAuthContract;
