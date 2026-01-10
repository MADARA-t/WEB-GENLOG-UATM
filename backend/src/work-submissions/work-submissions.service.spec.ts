import { Test, TestingModule } from '@nestjs/testing';
import { WorkSubmissionsService } from './work-submissions.service';

describe('WorkSubmissionsService', () => {
  let service: WorkSubmissionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkSubmissionsService],
    }).compile();

    service = module.get<WorkSubmissionsService>(WorkSubmissionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
