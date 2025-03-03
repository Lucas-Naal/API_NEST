import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const token = request.headers['authorization'] || request.headers['Authorization'];
        if (!token || !token.startsWith('Bearer ')) {
            throw new UnauthorizedException('Invalid token format');
        }


        try {

            const decoded = this.jwtService.verify(token.replace('Bearer ', ''), { secret: 'asdkhakujdhaskldhasujid' });
            request.user = decoded;
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }

        return true;
    }
}
