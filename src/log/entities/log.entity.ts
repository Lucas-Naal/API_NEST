import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Module } from '../../modules/entities/module.entity';
import { User } from 'src/user/entities/user.entity';

@Entity('logs')
export class Log {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Module, (module) => module.logs, { eager: true })
    @JoinColumn({ name: 'module_id' })
    module: Module;

    @ManyToOne(() => User, { eager: true, nullable: true })
    @JoinColumn({ name: 'usuario_id' })
    usuario: User | null;

    @Column({ type: 'enum', enum: ['ACTIVACION', 'AGREGACION', 'MODIFICACION', 'ELIMINACION', 'DESACTIVACION'] })
    action_name: string;

    @Column({ type: 'jsonb', nullable: true })
    original_data: any;

    @Column({ type: 'jsonb', nullable: true })
    updated_data: any;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
}
