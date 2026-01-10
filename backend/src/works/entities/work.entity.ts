import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { PedagogicalSpace } from '../../pedagogical-spaces/entities/pedagogical-space.entity';

export enum WorkType {
  INDIVIDUAL = 'individual',
  COLLECTIVE = 'collective'
}

@Entity('works')
export class Work {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: WorkType,
    default: WorkType.INDIVIDUAL
  })
  type: WorkType;

  @Column({ name: 'space_id' })
  spaceId: number;

  @ManyToOne(() => PedagogicalSpace, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'space_id' })
  space: PedagogicalSpace;

  @Column({ name: 'start_date', type: 'timestamp' })
  startDate: Date;

  @Column({ name: 'due_date', type: 'timestamp' })
  dueDate: Date;

  @Column({ type: 'int', default: 20 })
  points: number;

  @Column({ name: 'created_by' })
  createdBy: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'attachment_url', nullable: true })
attachmentUrl?: string;
}