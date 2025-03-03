import { Exclude, Expose } from "class-transformer";
import { Role } from "src/roles/entities/roles.entity";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    @Expose()
    id: number;

    @Column({ length: 150 })
    @Expose()
    name: string;

    @Column({ unique: true })
    @Expose()
    email: string;

    @Column()
    @Exclude()
    password: string;

    @ManyToOne(() => Role, { eager: true })  
    @JoinColumn({ name: 'role_id' })  
    role: Role;
    
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    @Expose()
    created_at: Date; 

    @Column({ type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP', nullable: true})
    @Expose()
    updated_at: Date; 

    @Column({ type: 'timestamp', nullable: true })
    @Expose()
    deleted_at: Date | null; 

    @Column({ type: 'boolean', default: true }) 
    @Expose()
    is_active: boolean;

    @Exclude()
    resetToken?: string; 
    
    @Exclude()
    resetTokenExpires?: Date;
    
}
