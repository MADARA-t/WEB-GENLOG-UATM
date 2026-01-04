import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePedagogicalSpaceDto } from './dto/create-pedagogical-space.dto';
import { UpdatePedagogicalSpaceDto } from './dto/update-pedagogical-space.dto';
import { PedagogicalSpace } from './entities/pedagogical-space.entity';

@Injectable()
export class PedagogicalSpacesService {
  constructor(
    @InjectRepository(PedagogicalSpace)
    private spacesRepository: Repository<PedagogicalSpace>,
  ) {}

  async create(createDto: CreatePedagogicalSpaceDto): Promise<PedagogicalSpace> {
    const space = this.spacesRepository.create(createDto);
    return await this.spacesRepository.save(space);
  }

  async findAll(): Promise<PedagogicalSpace[]> {
    return await this.spacesRepository.find({
      relations: ['promotion', 'formateur', 'technicien'],
    });
  }

  async findOne(id: number): Promise<PedagogicalSpace> {
    return await this.spacesRepository.findOne({
      where: { id },
      relations: ['promotion', 'formateur', 'technicien'],
    });
  }

  async update(id: number, updateDto: UpdatePedagogicalSpaceDto): Promise<PedagogicalSpace> {
    await this.spacesRepository.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.spacesRepository.delete(id);
  }
}