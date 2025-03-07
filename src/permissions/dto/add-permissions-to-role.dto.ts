import { IsArray, IsInt } from 'class-validator';

export class AddPermissionsToRoleDto {
    @IsInt()
    roleId: number;

    @IsArray()
    @IsInt({ each: true })
    permissionIds: number[];
}
