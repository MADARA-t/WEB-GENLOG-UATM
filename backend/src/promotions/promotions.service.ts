import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { Promotion } from './entities/promotion.entity';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectRepository(Promotion)
    private promotionsRepository: Repository<Promotion>,
  ) {}

  async create(createPromotionDto: CreatePromotionDto): Promise<Promotion> {
    const promotion = this.promotionsRepository.create(createPromotionDto);
    return await this.promotionsRepository.save(promotion);
  }

  async findAll(): Promise<Promotion[]> {
    return await this.promotionsRepository.find({
      relations: ['creator'],
    });
  }

  async findOne(id: number): Promise<Promotion> {
    return await this.promotionsRepository.findOne({
      where: { id },
      relations: ['creator'],
    });
  }

  async update(id: number, updatePromotionDto: UpdatePromotionDto): Promise<Promotion> {
    await this.promotionsRepository.update(id, updatePromotionDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.promotionsRepository.delete(id);
  }
}