import { Test, TestingModule } from '@nestjs/testing';
import { WorkAssignmentsService } from './work-assignments.service';

describe('WorkAssignmentsService', () => {
  let service: WorkAssignmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkAssignmentsService],
    }).compile();

    service = module.get<WorkAssignmentsService>(WorkAssignmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
