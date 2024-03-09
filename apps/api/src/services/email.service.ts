import env from '@/config';
import { emailHTML, lg, printErrorMessage } from '@/utils';
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

      lg.info(`✅  Email sent to '${email}' successfully!`);

      return response;
    } catch (error) {
      printErrorMessage(error, 'sendEmail()');
    }
  };
}

export const email = new EmailService();
