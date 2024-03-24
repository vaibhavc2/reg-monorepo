import ct from '@/constants';
import { handlers } from '@/handlers';
import middlewares from '@/middlewares';
import { validator } from '@/validation';
import { contracts } from '@reg/contracts';

const userRouter = ct.s.router(contracts.v1.UserContract, {
  'google-signup': {
    handler: handlers.v1.users.googleSignupHandler,
  },
  'register-with-email': {
    middleware: [
      middlewares.validation.zod(validator.zod.userDetails),
      middlewares.validation.zod(validator.zod.emailCredentials),
    ],
    handler: handlers.v1.users.registerWithEmailHandler,
  },
  'device-details': {
    middleware: [
      middlewares.auth.user,
      middlewares.validation.zod(validator.zod.deviceDetails),
    ],
    handler: handlers.v1.users.deviceDetailsHandler,
  },
});

export default userRouter;
