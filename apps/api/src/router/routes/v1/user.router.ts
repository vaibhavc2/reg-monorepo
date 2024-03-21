import ct from '@/constants';
import { handlers } from '@/handlers';
import middlewares from '@/middlewares';
import { validator } from '@/validation';
import { contracts } from '@reg/contracts';

const userRouter = ct.s.router(contracts.v1.UserContract, {
  'google-signup': {
    handler: handlers.v1.users.googleSignupHandler,
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
