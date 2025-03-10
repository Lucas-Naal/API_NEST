import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Log } from 'src/log/entities/log.entity';

@Entity('modules')
export class Module {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, unique: true })
    name: string;

    @OneToMany(() => Log, (log) => log.module)
    logs: Log[];
}
