import { insertSchema } from '@reg/db';
import * as z from 'zod';

const user = insertSchema.users.merge(
  insertSchema.emailCredentials.pick({ email: true }),
);

export type UserData = z.infer<typeof user>;
