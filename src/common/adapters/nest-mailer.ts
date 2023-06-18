import { Inject, Injectable } from '@nestjs/common';
import { MailerInterface, MailerOptions } from './mailer.interface';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class NestMailer implements MailerInterface {
  constructor(private readonly mailerService: MailerService) {}

  send(options: MailerOptions): Promise<void> {
    return this.mailerService.sendMail(options);
  }
}
