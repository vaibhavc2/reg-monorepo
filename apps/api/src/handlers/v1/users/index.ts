import { getUserDetailsHandler } from './get-user-details.handler';
import { googleOAuthHandler } from './google-oauth.handler';
import { loginWithEmailHandler } from './login-with-email.handler';
import { logoutHandler } from './logout.handler';
import { registerWithEmailHandler } from './register-with-email.handler';
import { registerWithPhoneHandler } from './register-with-phone.handler';
import { sendOTPToPhoneHandler } from './send-otp-to-phone.handler';
import { sendVerificationEmailHandler } from './send-verification-email.handler';
import { validateHandler } from './validate.handler';
import { verifyEmailHandler } from './verify-email.handler';
import { verifyPhoneOTPHandler } from './verify-phone-otp.handler';

export const usersHandlers = {
  googleOAuthHandler,
  registerWithEmailHandler,
  loginWithEmailHandler,
  logoutHandler,
  getUserDetailsHandler,
  verifyEmailHandler,
  sendVerificationEmailHandler,
  registerWithPhoneHandler,
  validateHandler,
  sendOTPToPhoneHandler,
  verifyPhoneOTPHandler,
};
