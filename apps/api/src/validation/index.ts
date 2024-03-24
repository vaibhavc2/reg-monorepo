import { largeStringError, minStringError, requiredError } from '@/utils';
import * as z from 'zod';

class Validation {
  public readonly zod: {
    userDetails: z.ZodObject<any, any, any>;
    deviceDetails: z.ZodObject<any, any, any>;
    emailCredentials: z.ZodObject<any, any, any>;
  };

  constructor() {
    this.zod = {
      userDetails: this.userDetails,
      deviceDetails: this.deviceDetails,
      emailCredentials: this.emailCredentials,
    };
  }

  private userDetails = z.object({
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

  private deviceDetails = z.object({
    body: z.object({
      deviceName: z
        .string({ required_error: requiredError('Device Name') })
        .max(255, { message: largeStringError('Device Name', 255) }),
      deviceModel: z
        .string({ required_error: requiredError('Device Model') })
        .max(255, { message: largeStringError('Device Model', 255) }),
      deviceManufacturer: z
        .string({ required_error: requiredError('Device Manufacturer') })
        .max(255, { message: largeStringError('Device Manufacturer', 255) }),
      deviceOs: z
        .string({ required_error: requiredError('Device OS') })
        .max(255, { message: largeStringError('Device OS', 255) }),
      deviceOsVersion: z
        .string({ required_error: requiredError('Device OS Version') })
        .max(255, { message: largeStringError('Device OS Version', 255) }),
      deviceType: z
        .string({ required_error: requiredError('Device Type') })
        .max(255, { message: largeStringError('Device Type', 255) }),
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