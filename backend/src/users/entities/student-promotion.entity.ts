import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Unique } from 'typeorm';
import { User } from './user.entity';
import { Promotion } from '../../promotions/entities/promotion.entity';

@Entity('student_promotions')
@Unique(['studentId', 'promotionId']) // Un étudiant ne peut être qu'une fois dans une promotion
export class StudentPromotion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'student_id' })
  studentId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: User;

  @Column({ name: 'promotion_id' })
  promotionId: number;

  @ManyToOne(() => Promotion, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'promotion_id' })
  promotion: Promotion;

  @CreateDateColumn({ name: 'enrollment_date' })
  enrollmentDate: Date;
}