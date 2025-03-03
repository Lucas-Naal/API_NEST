import { Module } from '@nestjs/common';
import { MailsService } from './mails.service';
import { MailsController } from './mails.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('MAILTRAP_HOST'),
          port: config.get('MAILTRAP_PORT'),
          secure: false,  
          auth: {
            user: config.get('MAILTRAP_USER'),
            pass: config.get('MAILTRAP_PASS'),
          },
        },
        defaults: {
          from: `"No Reply" <no-reply@mailtrap.io>`,  
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [MailsController],
  providers: [MailsService],
})
export class MailsModule {}
