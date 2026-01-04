import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentPromotion } from '../users/entities/student-promotion.entity';

@Injectable()
export class StudentPromotionsService {
  constructor(
    @InjectRepository(StudentPromotion)
    private studentPromotionsRepository: Repository<StudentPromotion>,
  ) {}

  async addStudentToPromotion(studentId: number, promotionId: number) {
    // Vérifier si l'étudiant n'est pas déjà dans cette promotion
    const existing = await this.studentPromotionsRepository.findOne({
      where: { studentId, promotionId },
    });

    if (existing) {
      throw new ConflictException('Cet étudiant est déjà dans cette promotion');
    }

    const studentPromotion = this.studentPromotionsRepository.create({
      studentId,
      promotionId,
    });

    return await this.studentPromotionsRepository.save(studentPromotion);
  }

  async getStudentsByPromotion(promotionId: number) {
    return await this.studentPromotionsRepository.find({
      where: { promotionId },
      relations: ['student'],
    });
  }

  async removeStudentFromPromotion(studentId: number, promotionId: number) {
    const result = await this.studentPromotionsRepository.delete({
      studentId,
      promotionId,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Association non trouvée');
    }

    return { message: 'Étudiant retiré de la promotion' };
  }
}