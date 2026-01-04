import { Controller, Post, Get, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { StudentPromotionsService } from './student-promotions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('student-promotions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentPromotionsController {
  constructor(private readonly studentPromotionsService: StudentPromotionsService) {}

  // Ajouter un étudiant à une promotion
  @Post()
  @Roles(UserRole.DIRECTEUR)
  addStudentToPromotion(@Body() body: { studentId: number; promotionId: number }) {
    return this.studentPromotionsService.addStudentToPromotion(body.studentId, body.promotionId);
  }

  // Voir les étudiants d'une promotion
  @Get('promotion/:promotionId')
  @Roles(UserRole.DIRECTEUR, UserRole.FORMATEUR)
  getStudentsByPromotion(@Param('promotionId') promotionId: string) {
    return this.studentPromotionsService.getStudentsByPromotion(+promotionId);
  }

  // Retirer un étudiant d'une promotion
  @Delete()
  @Roles(UserRole.DIRECTEUR)
  removeStudentFromPromotion(@Body() body: { studentId: number; promotionId: number }) {
    return this.studentPromotionsService.removeStudentFromPromotion(body.studentId, body.promotionId);
  }
}