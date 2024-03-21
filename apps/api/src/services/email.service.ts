import env from '@/config';
import { emailHTML, log, printErrorMessage } from '@/utils';
import { Resend } from 'resend';

class EmailService {
  private readonly resend: Resend;

  constructor() {
    this.resend = new Resend(env.RESEND_API_KEY);
  }

  public send = async (
    email: string,
    title: string,
    subject: string,
    message: string,
    content?: string,
  ) => {
    try {
      const response = await this.resend.emails.send({
        from: `${title} <${env.EMAIL_FROM}>`,
        to: email,
        subject,
        html: emailHTML(title, message, content),
      });

      log.info(`✅  Email sent to '${email}' successfully!`);

      return response;
    } catch (error) {
      printErrorMessage(error, 'sendEmail()');
    }
  };

  public sendVerificationEmail = async (email: string, token: string) => {
    const title = 'Email Verification: Registry App';
    const subject = 'Verify your email';
    const message = `Click the button below to verify your email address.`;
    const content = `<a href="${env.CLIENT_URL}/verify-email/${token}" style="text-decoration: none; color: white; background-color: #4CAF50; padding: 10px 20px; border-radius: 5px;">Verify Email</a>`;

    return this.send(email, title, subject, message, content);
  };
}

export const emailService = new EmailService();
