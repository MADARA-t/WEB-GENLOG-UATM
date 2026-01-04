import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Promotion } from '../../promotions/entities/promotion.entity';

@Entity('pedagogical_spaces')
export class PedagogicalSpace {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'promotion_id' })
  promotionId: number;

  @ManyToOne(() => Promotion)
  @JoinColumn({ name: 'promotion_id' })
  promotion: Promotion;

  @Column({ name: 'formateur_id', nullable: true })
  formateurId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'formateur_id' })
  formateur: User;

  @Column({ name: 'technicien_id', nullable: true })
  technicienId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'technicien_id' })
  technicien: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}