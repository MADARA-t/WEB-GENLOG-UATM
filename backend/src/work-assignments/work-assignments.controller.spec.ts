import { Test, TestingModule } from '@nestjs/testing';
import { WorkAssignmentsController } from './work-assignments.controller';
import { WorkAssignmentsService } from './work-assignments.service';

describe('WorkAssignmentsController', () => {
  let controller: WorkAssignmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkAssignmentsController],
      providers: [WorkAssignmentsService],
    }).compile();

    controller = module.get<WorkAssignmentsController>(WorkAssignmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
