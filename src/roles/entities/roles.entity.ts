import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Permission } from 'src/permissions/entities/permissions.entity';

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date; 

    @Column({ type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP', nullable: true})
    updated_at: Date; 

    @Column({ type: 'timestamp', nullable: true })
    deleted_at: Date | null; 


    @Column({ type: 'boolean', default: true }) 
    is_active: boolean;

    @ManyToMany(() => Permission, (permission) => permission.roles)
    @JoinTable({
        name: 'role_permissions',
        joinColumn: { name: 'role_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
    })
    permissions: Permission[];
}
