import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Role } from 'src/roles/entities/roles.entity';

@Entity('permissions')
export class Permission {
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
    
    @ManyToMany(() => Role, (role) => role.permissions)
    roles: Role[];
}
