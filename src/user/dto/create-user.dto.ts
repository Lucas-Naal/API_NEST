import { ApiProperty } from '@nestjs/swagger';
import { 
    IsString, 
    IsEmail, 
    MinLength, 
    IsOptional, 
    IsNumber, 
    IsBoolean, 
    Matches, 
    IsPositive 
} from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ example: 'Lucas Naal' })
    @IsString({ message: 'Name must be a string' })
    @MinLength(2, { message: 'Name must be at least 2 characters long' })
    name: string;
    
    @ApiProperty({ example: 'example@gmail.com' })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @ApiProperty({ example: 'StrongPass123!', description: 'Must contain uppercase, lowercase, number, and special character.' })
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    })
    password: string;
    
    @ApiProperty({ example: 1, description: 'ID of the assigned role.' })
    @IsOptional()
    @IsNumber({}, { message: 'Role ID must be a number' })
    @IsPositive({ message: 'Role ID must be greater than 0' })
    role?: number;

    @ApiProperty({ example: true, description: 'User account status.' })
    @IsOptional()
    @IsBoolean({ message: 'is_active must be a boolean value' })
    is_active?: boolean;
}
