import { appHandlers } from './app';
import { usersHandlers } from './users';

export const v1Handlers = {
  users: usersHandlers,
  app: appHandlers,
};
