import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';  
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { MailsService } from 'src/mails/mails.service';

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.register({
      secret: 'asdkhakujdhaskldhasujid',
      signOptions: { expiresIn: '3h' },
    }),
  ],
  providers: [AuthService, LocalStrategy, MailsService],
  exports: [AuthService],  
  controllers: [AuthController],
})
export class AuthModule {}
