import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/roles.entity';
import { Permission } from 'src/permissions/entities/permissions.entity';
import { RoleService } from './roles.service';
import { RoleController } from './roles.controller';
import { JwtModule } from '@nestjs/jwt';
import { RolesWithPermissionsView } from './entities/roles_with_permissions_view';
import { PermissionService } from 'src/permissions/permission.service';
import { Active_Permissions } from 'src/permissions/entities/active_permissions_view';

@Module({
    imports: [
        TypeOrmModule.forFeature([Role, Permission, RolesWithPermissionsView, Active_Permissions]),
        JwtModule,
    ],
    controllers: [RoleController],
    providers: [RoleService, PermissionService],
    exports: [RoleService, TypeOrmModule],  
})
export class RoleModule { }
