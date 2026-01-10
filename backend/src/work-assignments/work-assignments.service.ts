import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWorkAssignmentDto } from './dto/create-work-assignment.dto';
import { UpdateWorkAssignmentDto } from './dto/update-work-assignment.dto';
import { AssignToGroupDto } from './dto/assign-to-group.dto';
import { WorkAssignment } from './entities/work-assignment.entity';

@Injectable()
export class WorkAssignmentsService {
  constructor(
    @InjectRepository(WorkAssignment)
    private assignmentsRepository: Repository<WorkAssignment>,
  ) {}

  async create(createDto: CreateWorkAssignmentDto): Promise<WorkAssignment> {
    // Validation : soit studentId, soit groupName (pas les deux)
    if (!createDto.studentId && !createDto.groupName) {
      throw new BadRequestException('Either studentId or groupName must be provided');
    }

    if (createDto.studentId && createDto.groupName) {
      throw new BadRequestException('Cannot assign both studentId and groupName');
    }

    const assignment = this.assignmentsRepository.create(createDto);
    return await this.assignmentsRepository.save(assignment);
  }

  async assignToGroup(assignToGroupDto: AssignToGroupDto): Promise<WorkAssignment[]> {
    const { workId, groupName, studentIds } = assignToGroupDto;
    
    const assignments = studentIds.map(studentId => 
      this.assignmentsRepository.create({
        workId,
        studentId,
        groupName,
      })
    );

    return await this.assignmentsRepository.save(assignments);
  }

  async findAll(): Promise<WorkAssignment[]> {
    return await this.assignmentsRepository.find({
      relations: ['work', 'student'],
    });
  }

  async findByWork(workId: number): Promise<WorkAssignment[]> {
    return await this.assignmentsRepository.find({
      where: { workId },
      relations: ['work', 'student'],
    });
  }

  async findByStudent(studentId: number): Promise<WorkAssignment[]> {
    return await this.assignmentsRepository.find({
      where: { studentId },
      relations: ['work', 'student'],
    });
  }

  async findBySpace(spaceId: number): Promise<WorkAssignment[]> {
    return await this.assignmentsRepository
      .createQueryBuilder('assignment')
      .leftJoinAndSelect('assignment.work', 'work')
      .leftJoinAndSelect('assignment.student', 'student')
      .where('work.spaceId = :spaceId', { spaceId })
      .getMany();
  }

  async findOne(id: number): Promise<WorkAssignment> {
    const assignment = await this.assignmentsRepository.findOne({
      where: { id },
      relations: ['work', 'student'],
    });

    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }

    return assignment;
  }

  async update(id: number, updateDto: UpdateWorkAssignmentDto): Promise<WorkAssignment> {
    await this.assignmentsRepository.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.assignmentsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }
  }

  async removeByWorkAndStudent(workId: number, studentId: number): Promise<void> {
    const result = await this.assignmentsRepository.delete({ workId, studentId });
    if (result.affected === 0) {
      throw new NotFoundException('Assignment not found');
    }
  }
}