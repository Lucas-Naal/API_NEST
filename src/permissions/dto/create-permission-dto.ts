import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreatePermissionDto {
    @ApiProperty({ description: 'The name of the permission' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'The status of the permission (active or inactive)'})
    @IsBoolean()
    @IsOptional()
    is_active?: boolean;
}
