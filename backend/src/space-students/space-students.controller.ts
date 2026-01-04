import { Controller, Post, Get, Delete, Body, Param, UseGuards, Patch } from '@nestjs/common';
import { SpaceStudentsService } from './space-students.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('space-students')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SpaceStudentsController {
  constructor(private readonly spaceStudentsService: SpaceStudentsService) {}

  // US 3.3 : Ajouter un étudiant à un espace pédagogique
  @Post('student')
  @Roles(UserRole.DIRECTEUR, UserRole.FORMATEUR)
  addStudentToSpace(@Body() body: { studentId: number; spaceId: number }) {
    return this.spaceStudentsService.addStudentToSpace(body.studentId, body.spaceId);
  }

  // US 3.2 : Ajouter un formateur à un espace
  @Patch('formateur')
  @Roles(UserRole.DIRECTEUR)
  addFormateurToSpace(@Body() body: { formateurId: number; spaceId: number }) {
    return this.spaceStudentsService.addFormateurToSpace(body.formateurId, body.spaceId);
  }

  // Ajouter un technicien à un espace
  @Patch('technicien')
  @Roles(UserRole.DIRECTEUR)
  addTechnicienToSpace(@Body() body: { technicienId: number; spaceId: number }) {
    return this.spaceStudentsService.addTechnicienToSpace(body.technicienId, body.spaceId);
  }

  // Voir les étudiants d'un espace (US 3.5 inclus)
  @Get('space/:spaceId')
  @Roles(UserRole.DIRECTEUR, UserRole.FORMATEUR, UserRole.ETUDIANT)
  getStudentsBySpace(@Param('spaceId') spaceId: string) {
    return this.spaceStudentsService.getStudentsBySpace(+spaceId);
  }

  // Retirer un étudiant d'un espace
  @Delete('student')
  @Roles(UserRole.DIRECTEUR, UserRole.FORMATEUR)
  removeStudentFromSpace(@Body() body: { studentId: number; spaceId: number }) {
    return this.spaceStudentsService.removeStudentFromSpace(body.studentId, body.spaceId);
  }
}