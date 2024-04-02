import { getUserDetailsHandler } from './get-user-details.handler';
import { googleOAuthHandler } from './google-oauth.handler';
import { loginWithEmailHandler } from './login-with-email.handler';
import { logoutHandler } from './logout.handler';
import { registerWithEmailHandler } from './register-with-email.handler';

export const usersHandlers = {
  googleOAuthHandler,
  registerWithEmailHandler,
  loginWithEmailHandler,
  logoutHandler,
  getUserDetailsHandler,
};
