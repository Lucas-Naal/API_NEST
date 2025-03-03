import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryColumn, Column, ViewEntity } from 'typeorm';

@ViewEntity({ name: 'active_permissions_view' })  
export class Active_Permissions {
    @PrimaryColumn()
    @ApiProperty({ description: 'The unique identifier of the user' })
    id: number;

    @Column()
    @ApiProperty({ description: 'The name of the permission' })
    name: string;

    @Column()
    @ApiProperty({ description: 'The active status of the permission' })
    is_active: boolean;
}
