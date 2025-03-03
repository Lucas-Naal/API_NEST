import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({usernameField: 'email'});
    }

    async validate(email: string, password: string, recaptchaToken: string): Promise<any> {
        const user = await this.authService.validateUser(email, password, recaptchaToken);
    
        if (!user) {
            throw new UnauthorizedException('invalid credentials');
        }
        return user;
    }
    
    
}

