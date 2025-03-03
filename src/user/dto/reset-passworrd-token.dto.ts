// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
// import { User } from './use';  // Asegúrate de que tienes la entidad de Usuario

// @Entity()
// export class ResetPasswordToken {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ type: 'varchar', length: 255 })
//   token: string; // El token generado para el restablecimiento

//   @Column({ type: 'timestamp' })
//   expirationDate: Date; // La fecha de expiración del token

//   @ManyToOne(() => User, (user) => user.resetPasswordTokens)
//   @JoinColumn({ name: 'userId' })
//   user: User; // Relaciona este token con un usuario específico

//   @Column()
//   userId: number; // El ID del usuario al que pertenece este token
// }
