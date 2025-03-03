import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryColumn, Column, ViewEntity } from 'typeorm';

@ViewEntity({ name: 'admin_users_view' })  
export class AdminUserView {
    @PrimaryColumn()
    @ApiProperty({ description: 'The unique identifier of the user' })
    id: number;

    @Column()
    @ApiProperty({ description: 'The name of the user' })
    name: string;

    @Column()
    @ApiProperty({ description: 'The email of the user' })
    email: string;

    @Column()
    @ApiProperty({ description: 'The role ID of the user' })
    role_id: number;

    @Column()
    @ApiProperty({ description: 'The active status of the user' })
    is_active: boolean;
}
