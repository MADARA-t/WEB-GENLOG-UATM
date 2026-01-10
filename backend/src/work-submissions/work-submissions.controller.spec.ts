import { Test, TestingModule } from '@nestjs/testing';
import { WorkSubmissionsController } from './work-submissions.controller';
import { WorkSubmissionsService } from './work-submissions.service';

describe('WorkSubmissionsController', () => {
  let controller: WorkSubmissionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkSubmissionsController],
      providers: [WorkSubmissionsService],
    }).compile();

    controller = module.get<WorkSubmissionsController>(WorkSubmissionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
