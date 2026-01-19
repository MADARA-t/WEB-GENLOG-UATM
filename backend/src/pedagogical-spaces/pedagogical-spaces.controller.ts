import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PedagogicalSpacesService } from './pedagogical-spaces.service';
import { CreatePedagogicalSpaceDto } from './dto/create-pedagogical-space.dto';
import { UpdatePedagogicalSpaceDto } from './dto/update-pedagogical-space.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('pedagogical-spaces')
export class PedagogicalSpacesController {
  constructor(private readonly pedagogicalSpacesService: PedagogicalSpacesService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DIRECTEUR, UserRole.FORMATEUR) // Directeur et formateurs
  create(@Body() createDto: CreatePedagogicalSpaceDto) {
    return this.pedagogicalSpacesService.create(createDto);
  }

  @Get() 
  findAll() {
    return this.pedagogicalSpacesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DIRECTEUR, UserRole.FORMATEUR, UserRole.ETUDIANT)
  findOne(@Param('id') id: string) {
    return this.pedagogicalSpacesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DIRECTEUR, UserRole.FORMATEUR) // Directeur et formateurs
  update(@Param('id') id: string, @Body() updateDto: UpdatePedagogicalSpaceDto) {
    return this.pedagogicalSpacesService.update(+id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DIRECTEUR) // Seulement le directeur
  remove(@Param('id') id: string) {
    return this.pedagogicalSpacesService.remove(+id);
  }
}