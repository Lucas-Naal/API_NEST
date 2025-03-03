import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailsService {
  constructor(private mailerService: MailerService) {}

  async sendResetPasswordEmail(email: string, token: string, host: string) {
    const url = `${host}/reset-password/${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset Your Password',
      template: './welcome', 
      context: {
        host,
        token,
      },
    });
  }
}
