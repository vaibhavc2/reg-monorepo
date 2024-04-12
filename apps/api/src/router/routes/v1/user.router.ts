import ct from '@/constants';
import { handlers } from '@/handlers';
import middlewares from '@/middlewares';
import { validator } from '@/validation';
import { contracts } from '@reg/contracts';

const userRouter = ct.s.router(contracts.v1.UserContract, {
  'google-oauth': {
    handler: handlers.v1.users.googleOAuthHandler,
  },
  'register-with-email': {
    middleware: [
      middlewares.files.multer, // for handling form data or file uploads
      middlewares.validation.zod(validator.zod.email),
      middlewares.validation.zod(validator.zod.password),
    ],
    handler: handlers.v1.users.registerWithEmailHandler,
  },
  'login-with-email': {
    middleware: [
      middlewares.files.multer, // for handling form data or file uploads
      middlewares.validation.zod(validator.zod.email),
      middlewares.validation.zod(validator.zod.password),
    ],
    handler: handlers.v1.users.loginWithEmailHandler,
  },
  'register-with-phone': {
    middleware: [
      middlewares.files.multer, // for handling form data or file uploads
      middlewares.validation.zod(validator.zod.phone),
    ],
    handler: handlers.v1.users.registerWithPhoneHandler,
  },
  logout: {
    middleware: [middlewares.auth.user],
    handler: handlers.v1.users.logoutHandler,
  },
  validate: handlers.v1.users.validateHandler,
  'verify-email': {
    middleware: [middlewares.validation.zod(validator.zod.email)],
    handler: handlers.v1.users.verifyEmailHandler,
  },
  'send-verification-email': {
    middleware: [middlewares.validation.zod(validator.zod.email)],
    handler: handlers.v1.users.sendVerificationEmailHandler,
  },
  'send-otp-to-phone': {
    middleware: [middlewares.validation.zod(validator.zod.phone)],
    handler: handlers.v1.users.sendOTPToPhoneHandler,
  },
  'verify-phone-otp': {
    middleware: [middlewares.validation.zod(validator.zod.phone)],
    handler: handlers.v1.users.verifyPhoneOTPHandler,
  },
  'get-user-details': {
    middleware: [middlewares.auth.user],
    handler: handlers.v1.users.getUserDetailsHandler,
  },
  'get-user-sessions': {
    middleware: [middlewares.auth.user],
    handler: handlers.v1.users.getUserSessionsHandler,
  },
  'update-name': {
    middleware: [
      middlewares.auth.user,
      middlewares.validation.zod(validator.zod.fullName),
    ],
    handler: handlers.v1.users.updateNameHandler,
  },
  'generate-invitation-link': {
    middleware: [
      middlewares.auth.user,
      middlewares.validation.zod(validator.zod.role),
      middlewares.validation.zod(validator.zod.fullName),
      middlewares.validation.zod(validator.zod.phone),
    ],
    handler: handlers.v1.users.generateInvitationLinkHandler,
  },
  'verify-invitation-link': handlers.v1.users.verifyInvitationLinkHandler,
});

export default userRouter;
