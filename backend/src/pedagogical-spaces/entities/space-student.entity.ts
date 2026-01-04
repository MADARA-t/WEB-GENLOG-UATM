import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Unique } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { PedagogicalSpace } from './pedagogical-space.entity';

@Entity('space_students')
@Unique(['spaceId', 'studentId']) // Un étudiant ne peut être ajouté qu'une fois à un espace
export class SpaceStudent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'space_id' })
  spaceId: number;

  @ManyToOne(() => PedagogicalSpace, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'space_id' })
  space: PedagogicalSpace;

  @Column({ name: 'student_id' })
  studentId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: User;

  @CreateDateColumn({ name: 'joined_at' })
  joinedAt: Date;
}