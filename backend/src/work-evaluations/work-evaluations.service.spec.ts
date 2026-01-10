import { Test, TestingModule } from '@nestjs/testing';
import { WorkEvaluationsService } from './work-evaluations.service';

describe('WorkEvaluationsService', () => {
  let service: WorkEvaluationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkEvaluationsService],
    }).compile();

    service = module.get<WorkEvaluationsService>(WorkEvaluationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
