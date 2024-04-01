import ct from '@/constants';
import { handlers } from '@/handlers';
import middlewares from '@/middlewares';
import { validator } from '@/validation';
import { contracts } from '@reg/contracts';

const userRouter = ct.s.router(contracts.v1.UserContract, {
  'google-oauth': {
    handler: handlers.v1.users.googleOAuthHandler,
  },
  'auth-with-email': {
    middleware: [
      middlewares.files.multer, // for handling form data or file uploads
      middlewares.validation.zod(validator.zod.userDetails),
      middlewares.validation.zod(validator.zod.emailCredentials),
    ],
    handler: handlers.v1.users.emailRegistrationHandler,
  },
});

export default userRouter;
