import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Work } from '../../works/entities/work.entity';
import { User } from '../../users/entities/user.entity';

@Entity('work_assignments')
export class WorkAssignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'work_id' })
  workId: number;

  @ManyToOne(() => Work, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'work_id' })
  work: Work;

  @Column({ name: 'student_id', nullable: true })
  studentId: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'student_id' })
  student: User;

  @Column({ name: 'group_name', nullable: true, length: 100 })
  groupName: string;

  @CreateDateColumn({ name: 'assigned_at' })
  assignedAt: Date;
}