import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from 'src/user/user.service';
import * as nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid'; 
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AuthService {
    private readonly recaptchaSecret = '6Lf4jd4qAAAAAIjUwb9YNKSiqv_mlBkZycDq2xNt';  

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}
    private async verifyRecaptcha(token: string): Promise<boolean> {
        const url = `https://www.google.com/recaptcha/api/siteverify`;
        try {
            const response = await axios.post(url, null, {
                params: {
                    secret: this.recaptchaSecret,
                    response: token,
                },
            });

            return response.data.success;
        } catch (error) {
            console.error('Error al verificar reCAPTCHA:', error);
            return false;
        }
    }

    async validateUser(email: string, password: string, recaptchaToken: string): Promise<any> {
        const isRecaptchaValid = await this.verifyRecaptcha(recaptchaToken);
        if (!isRecaptchaValid) {
            throw new UnauthorizedException('reCAPTCHA no válido');
        }
    
        const user = await this.userService.findByEmail(email);
    
        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
        }
    
        if (user.deleted_at) {
            throw new UnauthorizedException('La cuenta de usuario está eliminada');
        }
    
        if (!user.is_active) {
            throw new UnauthorizedException('La cuenta de usuario está inactiva');
        }
    
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new UnauthorizedException('Credenciales inválidas');
        }
    
        const { password: _, ...result } = user;
    
        const permissions = await this.getUserPermissions(user);
    
        const userWithRole = {
            ...result,
            role: user.role,
            permissions: permissions, 
        };
    
        return userWithRole;
    }
    
    async getUserPermissions(user: any): Promise<string[]> {
        const permissionsArray = ['visualizar tablas', 'actualizar estado', 'editar usuarios', 'crear usuarios', 'eliminar usuarios'];

        if (user.role.name === 'administrador') {
            return permissionsArray;
        } else if (user.role.name === 'usuario') {
            return ['visualizar tablas']; 
        }
        return []; 
    }
    
    async login(user: any) {
        const payload = { 
            email: user.email, 
            sub: user.id, 
            role: user.role, 
            permissions: user.permissions, 
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    

    async sendResetPasswordEmail(email: string): Promise<string> {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }

        const resetToken = uuidv4();  

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "**********",  
                pass: "********", 
            },
        });

        const resetLink = `http://localhost:5173/resetpassword?token=${resetToken}`;

        await transporter.sendMail({
            to: email,
            subject: 'Restablecer tu contraseña',
            text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetLink}`,
        });

        return 'Correo de restablecimiento enviado';
    }
}
