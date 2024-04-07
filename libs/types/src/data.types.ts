import { insertSchema } from '@reg/db';
import * as z from 'zod';

const user = insertSchema.users;

// const userData = insertSchema.users.merge(
//   insertSchema.emailCredentials.pick({ email: true }),
// );
const userData = insertSchema.users;

export type User = z.infer<typeof user>;
export type UserData = z.infer<typeof userData> & {
  email?: string;
  phone?: string;
};
