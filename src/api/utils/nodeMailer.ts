import nodemailer, { Transporter } from 'nodemailer';

export interface MailerOptions {
  host?: string;
  port?: number;
  secure?: boolean;
  auth?: {
    user: string;
    pass: string;
  };
}

export interface ImailOptions {
  from?: string;
  to: string;
  subject: string;
  text: string;
}

class Mailer {
  private transporter: Transporter;

  constructor(options?: MailerOptions) {
    if (options) {
      this.transporter = nodemailer.createTransport(options);
    } else {
      const { EMAIL_SERVER_HOST, EMAIL_SERVER_PORT, SMTP_SECURE, QUESTIONIAR_GMAIL_USERNAME, QUESTIONIAR_GMAIL_PASSWORD } = process.env;
      if (!EMAIL_SERVER_HOST || !EMAIL_SERVER_PORT || !QUESTIONIAR_GMAIL_USERNAME || !QUESTIONIAR_GMAIL_PASSWORD) {
        throw new Error('Email server details are not defined');
      }
      this.transporter = nodemailer.createTransport({
        host: EMAIL_SERVER_HOST,
        port: Number(EMAIL_SERVER_PORT),
        secure: SMTP_SECURE === 'true',
        auth: {
          user: QUESTIONIAR_GMAIL_USERNAME,
          pass: QUESTIONIAR_GMAIL_PASSWORD,
        },
      });
    }
  }

  async sendMail(mailOptions: ImailOptions) {
    try {
      let info = await this.transporter.sendMail(mailOptions);
      console.log(`Message sent: ${info.messageId}`);
      return info;
    } catch (error) {
      console.error(`Error occurred while sending mail: ${error}`);
      throw error;
    }
  }
}

export default Mailer;
