import { Module } from '@nestjs/common';
import { WorkSubmissionsService } from './work-submissions.service';
import { WorkSubmissionsController } from './work-submissions.controller';

@Module({
  controllers: [WorkSubmissionsController],
  providers: [WorkSubmissionsService],
})
export class WorkSubmissionsModule {}
