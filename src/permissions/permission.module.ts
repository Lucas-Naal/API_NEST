import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permissions.entity';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { Active_Permissions } from './entities/active_permissions_view';
import { RoleModule } from 'src/roles/roles.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Permission, Active_Permissions]),
        AuthModule,
        JwtModule,
        RoleModule,
    ],
    controllers: [PermissionController],
    providers: [PermissionService],
    exports: [PermissionService],
})
export class PermissionModule { }
