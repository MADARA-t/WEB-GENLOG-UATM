import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';
import { Work } from './entities/work.entity';

@Injectable()
export class WorksService {
  constructor(
    @InjectRepository(Work)
    private worksRepository: Repository<Work>,
  ) {}

  async create(createWorkDto: CreateWorkDto): Promise<Work> {
    const work = this.worksRepository.create(createWorkDto);
    return await this.worksRepository.save(work);
  }

  async findAll(): Promise<Work[]> {
    return await this.worksRepository.find({
      relations: ['space', 'creator'],
    });
  }

  async findBySpace(spaceId: number): Promise<Work[]> {
    return await this.worksRepository.find({
      where: { spaceId },
      relations: ['space', 'creator'],
    });
  }

  async findOne(id: number): Promise<Work> {
    const work = await this.worksRepository.findOne({
      where: { id },
      relations: ['space', 'creator'],
    });

    if (!work) {
      throw new NotFoundException(`Work with ID ${id} not found`);
    }

    return work;
  }

  async update(id: number, updateWorkDto: UpdateWorkDto): Promise<Work> {
    await this.worksRepository.update(id, updateWorkDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.worksRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Work with ID ${id} not found`);
    }
  }
}