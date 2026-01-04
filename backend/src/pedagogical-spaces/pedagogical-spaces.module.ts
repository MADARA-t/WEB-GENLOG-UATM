import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedagogicalSpacesService } from './pedagogical-spaces.service';
import { PedagogicalSpacesController } from './pedagogical-spaces.controller';
import { PedagogicalSpace } from './entities/pedagogical-space.entity';
import { SpaceStudent } from './entities/space-student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PedagogicalSpace, SpaceStudent])],
  controllers: [PedagogicalSpacesController],
  providers: [PedagogicalSpacesService],
  exports: [PedagogicalSpacesService],
})
export class PedagogicalSpacesModule {}