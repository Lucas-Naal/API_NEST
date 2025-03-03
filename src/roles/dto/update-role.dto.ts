import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role-dto';
import { IsString, IsOptional, IsArray, IsInt, IsPositive, IsBoolean, ArrayNotEmpty } from 'class-validator';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsArray()
    @ArrayNotEmpty({ message: 'Permissions must not be empty' })
    @IsInt({ each: true })
    @IsPositive({ each: true })
    permissions?: number[];

    @IsOptional()
    @IsBoolean()
    is_active?: boolean;

}
