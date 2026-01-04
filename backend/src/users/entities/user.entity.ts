import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

export enum UserRole {
  DIRECTEUR = 'directeur',
  FORMATEUR = 'formateur',
  ETUDIANT = 'etudiant',
  TECHNICIEN = 'technicien',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ length: 255, nullable: true })
  password: string;

  @Column({ name: 'first_name', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', length: 100 })
  lastName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;

  @Column({ name: 'is_active', default: false })
  isActive: boolean;

  @Column({ name: 'activation_token', nullable: true, length: 255 })
  activationToken: string;

  @Column({ name: 'token_expires_at', nullable: true, type: 'timestamp' })
  tokenExpiresAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}