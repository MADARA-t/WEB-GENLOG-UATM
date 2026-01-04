import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaceStudentsController } from './space-students.controller';
import { SpaceStudentsService } from './space-students.service';
import { SpaceStudent } from '../pedagogical-spaces/entities/space-student.entity';
import { PedagogicalSpace } from '../pedagogical-spaces/entities/pedagogical-space.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SpaceStudent, PedagogicalSpace])],
  controllers: [SpaceStudentsController],
  providers: [SpaceStudentsService],
})
export class SpaceStudentsModule {}