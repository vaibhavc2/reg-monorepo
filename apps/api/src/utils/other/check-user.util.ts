import { UserData } from '@reg/types';

export const checkUser = (user?: UserData) => {
  if (!user?.id || user?.status !== 'active') {
    return false;
  } else return true;
};

export const checkModerator = (user?: UserData) => {
  if (
    !checkUser(user) ||
    (user?.role !== 'moderator' && user?.role !== 'admin')
  ) {
    return false;
  } else return true;
};

export const checkAdmin = (user?: UserData) => {
  if (!checkUser(user) || user?.role !== 'admin') {
    return false;
  } else return true;
};
