import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { Role } from 'src/roles/entities/roles.entity';
import { AdminUserView } from './entities/admin_user_view';
import { NonAdminUserView } from './entities/non_admin_users_view';
import { ActiveUsers_View } from './entities/view_active_users';
import { MailsService } from 'src/mails/mails.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, AdminUserView, NonAdminUserView, ActiveUsers_View]), 
  forwardRef(() => AuthModule), JwtModule],
  controllers: [UserController],
  providers: [UserService, JwtAuthGuard, MailsService],
  exports: [UserService],
})
export class UserModule { }
