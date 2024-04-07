import env from '@/config';
import { ApiError } from '@/utils';
import twilio from 'twilio';

class TwilioService {
  private client: twilio.Twilio;

  constructor() {
    this.client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN, {
      lazyLoading: true,
      autoRetry: true,
      maxRetries: 3,
      ...(!env.isProduction ? { logLevel: 'debug' } : null),
    });
  }

  async sendSMS(to: string, body: string) {
    return await this.client.messages
      .create({
        body,
        to,
        from: env.TWILIO_PHONE_NUMBER,
      })
      .catch((error) => {
        throw new ApiError(500, 'Failed to send SMS', error);
      });
  }

  async sendOTP(to: string) {
    return await this.client.verify.v2
      .services(env.TWILIO_SERVICE_SID)
      .verifications.create({
        to,
        channel: 'sms',
      })
      .catch((error) => {
        throw new ApiError(500, 'Failed to send OTP', error);
      });
  }

  async verifyOTP(to: string, code: string) {
    return (
      (
        await this.client.verify.v2
          .services(env.TWILIO_SERVICE_SID)
          .verificationChecks.create({
            to,
            code,
          })
          .catch((error) => {
            throw new ApiError(500, 'Failed to verify OTP', error);
          })
      ).status === 'approved'
    );
  }
}

export const twilioService = new TwilioService();
