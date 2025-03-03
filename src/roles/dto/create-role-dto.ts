import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsInt, IsOptional, ArrayNotEmpty, IsPositive, IsBoolean } from 'class-validator';

export class CreateRoleDto {
    @ApiProperty({ description: 'The name of the role' })
    @IsString({ message: 'Role name must be a string' })
    name: string;

    @ApiProperty({
        description: 'List of permission IDs associated with the role',
        type: [Number],
        example: [1, 2, 3], 
    })
    @IsArray({ message: 'Permissions must be an array' })
    @ArrayNotEmpty({ message: 'At least one permission is required' })
    @IsInt({ each: true, message: 'Each permission ID must be an integer' })
    @IsPositive({ each: true, message: 'Each permission ID must be greater than 0' })
    permissions: number[];

    @IsOptional()
    @IsBoolean()
    is_active?: boolean;
}
