import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdatePermissionDto {
    @ApiProperty({ description: 'The updated name of the permission' })
    @IsString()
    name: string;

        @ApiProperty({ description: 'The status of the permission (active or inactive)'})
        @IsBoolean()
        @IsOptional()
        is_active?: boolean;
}
