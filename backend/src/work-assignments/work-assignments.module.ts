import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkAssignmentsService } from './work-assignments.service';
import { WorkAssignmentsController } from './work-assignments.controller';
import { WorkAssignment } from './entities/work-assignment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkAssignment])],
  controllers: [WorkAssignmentsController],
  providers: [WorkAssignmentsService],
  exports: [WorkAssignmentsService],
})
export class WorkAssignmentsModule {}