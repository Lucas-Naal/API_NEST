import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryColumn, Column, ViewEntity } from 'typeorm';

@ViewEntity({ name: 'active_users_view' })  
export class ActiveUsers_View {
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
    @ApiProperty({ description: 'The role name of the user' })
    role_name: string;

    @Column()
    @ApiProperty({ description: 'The date of creation of the user' })
    created_at: Date;

    @Column()
    @ApiProperty({ description: 'The date  of the user' })
    updated_at: Date;

    @Column()
    @ApiProperty({ description: 'The active status of the user' })
    is_active: boolean;
}
