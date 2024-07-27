import { getUserDetailsHandler } from './get-user-details.handler';
import { getUserSessionsHandler } from './get-user-sessions.handler';
import { googleOAuthHandler } from './google-oauth.handler';
import { loginWithEmailHandler } from './login-with-email.handler';
import { logoutHandler } from './logout.handler';
import { generateInvitationLinkHandler } from './moderator/generate-invitation-link.handler';
import { grantOrRevokeAccessHandler } from './moderator/grant-or-revoke-access.handler';
import { registerWithEmailHandler } from './register-with-email.handler';
import { registerWithPhoneHandler } from './register-with-phone.handler';
import { sendOTPToPhoneHandler } from './send-otp-to-phone.handler';
import { sendVerificationEmailHandler } from './send-verification-email.handler';
import { updateNameHandler } from './update-name.handler';
import { updatePasswordHandler } from './update-password.handler';
import { validateHandler } from './validate.handler';
import { verifyEmailHandler } from './verify-email.handler';
import { verifyInvitationLinkHandler } from './verify-invitation-link.handler';
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
  updateNameHandler,
  getUserSessionsHandler,
  generateInvitationLinkHandler,
  verifyInvitationLinkHandler,
  updatePasswordHandler,
  grantOrRevokeAccessHandler,
};
