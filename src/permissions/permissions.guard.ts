import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity'; 

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());

    if (!requiredPermissions) {
      return true; 
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user; 

    if (!user) {
      throw new UnauthorizedException('No user found');
    }


    const userPermissions = user.role.permissions.map(permission => permission.name);

    const hasAdminPermission = userPermissions.includes('administrador');
    if (hasAdminPermission) {
      return true;  
    }
    const hasPermission = requiredPermissions.some(permission =>
      userPermissions.includes(permission),
    );

    if (!hasPermission) {
      throw new UnauthorizedException('Insufficient permissions');
    }

    return true;
  }
}
