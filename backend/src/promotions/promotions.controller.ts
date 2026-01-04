import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('promotions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Post()
  @Roles(UserRole.DIRECTEUR) // Seulement le directeur
  create(@Body() createPromotionDto: CreatePromotionDto) {
    return this.promotionsService.create(createPromotionDto);
  }

  @Get()
  @Roles(UserRole.DIRECTEUR, UserRole.FORMATEUR) // Directeur et formateurs
  findAll() {
    return this.promotionsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.DIRECTEUR, UserRole.FORMATEUR)
  findOne(@Param('id') id: string) {
    return this.promotionsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRole.DIRECTEUR) // Seulement le directeur
  update(@Param('id') id: string, @Body() updatePromotionDto: UpdatePromotionDto) {
    return this.promotionsService.update(+id, updatePromotionDto);
  }

  @Delete(':id')
  @Roles(UserRole.DIRECTEUR) // Seulement le directeur
  remove(@Param('id') id: string) {
    return this.promotionsService.remove(+id);
  }
}