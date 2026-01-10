import { Module } from '@nestjs/common';
import { WorkEvaluationsService } from './work-evaluations.service';
import { WorkEvaluationsController } from './work-evaluations.controller';

@Module({
  controllers: [WorkEvaluationsController],
  providers: [WorkEvaluationsService],
})
export class WorkEvaluationsModule {}
