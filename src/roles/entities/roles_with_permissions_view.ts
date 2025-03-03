import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryColumn, Column, ViewEntity } from 'typeorm';

@ViewEntity({ name: 'roles_with_permissions_view' })  
export class RolesWithPermissionsView {
    @PrimaryColumn()
    @ApiProperty({ description: 'The unique identifier of the role' })
    role_id: number;

    @Column()
    @ApiProperty({ description: 'The name of the role' })
    role_name: string;

    @Column()
    @ApiProperty({ description: 'The active status of the role' })
    is_active: boolean;

    @Column()
    @ApiProperty({ description: 'The unique identifier of the permission' })
    permission_id: number;

    @Column()
    @ApiProperty({ description: 'The name of the permission' })
    permission_name: string;
}
