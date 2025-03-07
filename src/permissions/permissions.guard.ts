import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class PermissionsGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user?.role?.name === 'administrador') {
      return true; 
    }

    const permissions = user?.permissions || [];

    const requiredPermissions = this.getRequiredPermissions(context);

    const hasPermissions = requiredPermissions.every(permission =>
      permissions.includes(permission)
    );

    if (!hasPermissions) {
    
    }

    return hasPermissions; 
  }

  private getRequiredPermissions(context: ExecutionContext): string[] {
    const handler = context.getHandler();
    return Reflect.getMetadata('permissions', handler) || [];
  }
}
