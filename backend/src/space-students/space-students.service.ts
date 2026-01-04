import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpaceStudent } from '../pedagogical-spaces/entities/space-student.entity';
import { PedagogicalSpace } from '../pedagogical-spaces/entities/pedagogical-space.entity';

@Injectable()
export class SpaceStudentsService {
  constructor(
    @InjectRepository(SpaceStudent)
    private spaceStudentsRepository: Repository<SpaceStudent>,
    @InjectRepository(PedagogicalSpace)
    private spacesRepository: Repository<PedagogicalSpace>,
  ) {}

  // Ajouter un étudiant à un espace pédagogique (US 3.3)
  async addStudentToSpace(studentId: number, spaceId: number) {
    // Vérifier si l'étudiant n'est pas déjà dans cet espace
    const existing = await this.spaceStudentsRepository.findOne({
      where: { studentId, spaceId },
    });

    if (existing) {
      throw new ConflictException('Cet étudiant est déjà dans cet espace pédagogique');
    }

    const spaceStudent = this.spaceStudentsRepository.create({
      studentId,
      spaceId,
    });

    return await this.spaceStudentsRepository.save(spaceStudent);
  }

  // Ajouter/Modifier un formateur dans un espace (US 3.2)
  async addFormateurToSpace(formateurId: number, spaceId: number) {
    const space = await this.spacesRepository.findOne({ where: { id: spaceId } });

    if (!space) {
      throw new NotFoundException('Espace pédagogique non trouvé');
    }

    space.formateurId = formateurId;
    return await this.spacesRepository.save(space);
  }

  // Ajouter/Modifier un technicien dans un espace
  async addTechnicienToSpace(technicienId: number, spaceId: number) {
    const space = await this.spacesRepository.findOne({ where: { id: spaceId } });

    if (!space) {
      throw new NotFoundException('Espace pédagogique non trouvé');
    }

    space.technicienId = technicienId;
    return await this.spacesRepository.save(space);
  }

  // Voir les étudiants d'un espace
  async getStudentsBySpace(spaceId: number) {
    return await this.spaceStudentsRepository.find({
      where: { spaceId },
      relations: ['student'],
    });
  }

  // Retirer un étudiant d'un espace
  async removeStudentFromSpace(studentId: number, spaceId: number) {
    const result = await this.spaceStudentsRepository.delete({
      studentId,
      spaceId,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Association non trouvée');
    }

    return { message: 'Étudiant retiré de l\'espace pédagogique' };
  }
}