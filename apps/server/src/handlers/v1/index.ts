import { appHandlers } from './app';
import { personsHandlers } from './persons';
import { usersHandlers } from './users';

export const v1Handlers = {
  users: usersHandlers,
  persons: personsHandlers,
  app: appHandlers,
};
