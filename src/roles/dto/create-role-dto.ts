import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsInt, IsOptional, IsBoolean, ArrayNotEmpty, IsPositive } from 'class-validator';

export class CreateRoleDto {
    @ApiProperty({ description: 'The name of the role' })
    @IsString({ message: 'Role name must be a string' })
    name: string;

    @ApiProperty({
        description: 'List of permission IDs associated with the role',
        type: [Number],
        example: [1, 2, 3], 
        required: false,
    })
    @IsArray({ message: 'Permissions must be an array' })
    @IsOptional()
    @IsInt({ each: true, message: 'Each permission ID must be an integer' })
    @IsPositive({ each: true, message: 'Each permission ID must be greater than 0' })
    permissions?: number[];

    @IsOptional()
    @IsBoolean()
    is_active?: boolean;
}
