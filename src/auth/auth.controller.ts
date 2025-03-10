import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/forgot-password';
import { ForgotPasswordDTO } from 'src/mails/dto/forgot-password.dto';
import { MailsService } from 'src/mails/mails.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly mailService: MailsService
    ) { }

    @Post('login')
    @ApiOperation({ summary: 'Login de usuario para obtener JWT' })
    @ApiResponse({ status: 200, description: 'Login exitoso.' })
    @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
    async login(@Body() loginDto: LoginDto) {
        const { email, password, recaptchaToken } = loginDto;

        const user = await this.authService.validateUser(email, password, recaptchaToken);

        return this.authService.login(user);
    }

    @Post('forgot-password')
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDTO) {
        const { email } = forgotPasswordDto;
        const token = 'generated-reset-token';
        const host = 'http://localhost:5173';

        try {
            await this.mailService.sendResetPasswordEmail(email, token, host);
            return { message: 'Si el correo existe, se ha enviado un correo con instrucciones para restablecer la contraseña.' };
        } catch (error) {
            console.error('Error al enviar el correo:', error);
            throw new Error('Hubo un error al procesar tu solicitud');
        }
    }


    @Get('profile')
    getProfile(@Req() req) {
        console.log('req.user:', req.user); 
        return req.user; 
    }


}
