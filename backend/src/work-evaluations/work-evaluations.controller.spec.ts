import { Test, TestingModule } from '@nestjs/testing';
import { WorkEvaluationsController } from './work-evaluations.controller';
import { WorkEvaluationsService } from './work-evaluations.service';

describe('WorkEvaluationsController', () => {
  let controller: WorkEvaluationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkEvaluationsController],
      providers: [WorkEvaluationsService],
    }).compile();

    controller = module.get<WorkEvaluationsController>(WorkEvaluationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
