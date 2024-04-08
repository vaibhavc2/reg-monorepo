import { largeStringError, minStringError, requiredError } from '@/utils';
import * as z from 'zod';

class Validation {
  public readonly zod: {
    fullName: z.ZodObject<any, any, any>;
    emailCredentials: z.ZodObject<any, any, any>;
  };

  constructor() {
    this.zod = {
      fullName: this.fullName,
      emailCredentials: this.emailCredentials,
    };
  }

  private fullName = z.object({
    body: z.object({
      fullName: z
        .string({ required_error: requiredError('Full Name') })
        .min(3, { message: minStringError('Full Name', 3) })
        .max(30, { message: largeStringError('Full Name', 30) })
        .regex(/^[a-zA-Z\s]*$/, {
          message: 'Full Name can only contain: letters and spaces',
        }),
    }),
  });

  private emailCredentials = z.object({
    body: z.object({
      email: z
        .string({ required_error: requiredError('Email') })
        .email({ message: 'Invalid Email' }),
      password: z
        .string({ required_error: requiredError('Password') })
        .min(6, { message: minStringError('Password', 6) })
        .max(30, { message: largeStringError('Password', 30) })
        .regex(/^(?=.*\d)(?=.*\W).*$/, {
          message: 'Password must contain at least a digit, and a symbol.',
        }),
    }),
  });
}

export const validator = new Validation();
