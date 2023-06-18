import { Module } from '@nestjs/common';
import provider from './configs/provider';
import { BcryptEncrypter } from './adapters/bcrypt-encrypter';
import { JwtAuthToken } from './adapters/jwt-auth-token';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { NestMailer } from './adapters/nest-mailer';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        return {
          global: true,
          secret: config.get('JWT_SECRET'),
          signOptions: { expiresIn: '1h' },
        };
      },
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        return {
          transport: {
            host: config.get('EMAIL_HOST'),
            port: config.get('EMAIL_PORT'),
            auth: {
              user: config.get('EMAIL_AUTH_USER'),
              pass: config.get('EMAIL_AUTH_PASS'),
            },
          },
          template: {
            dir: __dirname + '../../../../views',
            adapter: new HandlebarsAdapter(),
          },
        };
      },
    }),
  ],
  providers: [
    {
      provide: provider.ENCRYPTER,
      useClass: BcryptEncrypter,
    },
    {
      provide: provider.AUTH_TOKEN,
      useClass: JwtAuthToken,
    },
    {
      provide: provider.MAILER,
      useClass: NestMailer,
    },
  ],
  exports: [
    {
      provide: provider.ENCRYPTER,
      useClass: BcryptEncrypter,
    },
    {
      provide: provider.AUTH_TOKEN,
      useClass: JwtAuthToken,
    },
    {
      provide: provider.MAILER,
      useClass: NestMailer,
    },
  ],
})
export class CommonModule {}
