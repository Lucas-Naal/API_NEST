// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
//     constructor(private configService: ConfigService) {
//         super({
//             jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//             ignoreExpiration: false,
//             secretOrKey: configService.get<string>('JWT_SECRET'),
//         });
//     }

//     async validate(payload: any) {
//         console.log('Payload recibido en validate():', payload);

//         return { 
//             id: payload.sub,  
//             email: payload.email, 
//             role: payload.role,
//             permissions: payload.permissions
//         };
//     }

// }
