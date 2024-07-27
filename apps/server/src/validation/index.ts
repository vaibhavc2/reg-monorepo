import { largeStringError, minStringError, requiredError } from '@/utils';
import * as z from 'zod';

class Validation {
  public readonly zod: {
    userId: z.ZodObject<any, any, any>;
    fullName: z.ZodObject<any, any, any>;
    email: z.ZodObject<any, any, any>;
    phone: z.ZodObject<any, any, any>;
    password: z.ZodObject<any, any, any>;
    role: z.ZodObject<any, any, any>;
  };

  constructor() {
    this.zod = {
      userId: this.userId,
      fullName: this.fullName,
      email: this.email,
      phone: this.phone,
      password: this.password,
      role: this.role,
    };
  }

  private userId = z.object({
    body: z.object({
      userId: z.number({ required_error: requiredError('User ID') }).int({
        message: 'Invalid User ID! Must be a valid integer value',
      }),
    }),
  });

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

  private email = z.object({
    body: z.object({
      email: z.string({ required_error: requiredError('Email') }).email({
        message: 'Invalid Email! Must be in the format: abc@email.com',
      }),
    }),
  });

  private password = z.object({
    body: z.object({
      password: z
        .string({ required_error: requiredError('Password') })
        .min(6, { message: minStringError('Password', 6) })
        .max(30, { message: largeStringError('Password', 30) })
        .regex(/^(?=.*\d)(?=.*\W).*$/, {
          message: 'Password must contain at least a digit, and a symbol.',
        }),
    }),
  });

  private phone = z.object({
    // validation for phone number: e164 format, only Indian numbers are allowed
    body: z.object({
      phone: z
        .string({ required_error: requiredError('Phone Number') })
        .min(13, { message: minStringError('Phone Number', 13) })
        .max(20, { message: largeStringError('Phone Number', 20) })
        .regex(/^\+91\d{10}$/, {
          message: 'Invalid Phone Number! Must be in the format: +91XXXXXXXXXX',
        }),
    }),
  });

  private role = z.object({
    body: z.object({
      role: z
        .string({ required_error: requiredError('Role') })
        .min(4, { message: minStringError('Role', 4) })
        .max(9, { message: largeStringError('Role', 9) })
        .regex(/^(admin|moderator|user)$/, {
          message: 'Invalid Role! Must be one of: admin, moderator, user',
        }),
    }),
  });
}

export const validator = new Validation();
