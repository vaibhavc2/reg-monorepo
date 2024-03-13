import { insertSchema } from '@reg/db';
import { contract } from '../contract';
import { addPrefixToRoutes } from '../utils';

const routes = {
  register: {
    method: 'POST',
    path: '/register',
    responses: {
      400: contract.type<{ message: 'User already exists' }>(),
      201: insertSchema.users
        .pick({ id: true, fullName: true, createdAt: true, updatedAt: true })
        .merge(insertSchema.usernames.pick({ value: true }))
        .merge(insertSchema.userCredentials.pick({ email: true }))
        .transform(({ value, ...rest }) => {
          return {
            username: value,
            ...rest,
          };
        }),
    },
    body: contract.type<{
      fullName: string;
      email: string;
      password: string;
    }>(),
    summary: 'Register a new user using email and password.',
  },
};

const prefixedRoutes = addPrefixToRoutes(routes, '/users');

const UserContract = contract.router(prefixedRoutes, {
  strictStatusCodes: true,
});

export default UserContract;
