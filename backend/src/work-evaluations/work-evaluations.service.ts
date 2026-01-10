import { Injectable } from '@nestjs/common';
import { CreateWorkEvaluationDto } from './dto/create-work-evaluation.dto';
import { UpdateWorkEvaluationDto } from './dto/update-work-evaluation.dto';

@Injectable()
export class WorkEvaluationsService {
  create(createWorkEvaluationDto: CreateWorkEvaluationDto) {
    return 'This action adds a new workEvaluation';
  }

  findAll() {
    return `This action returns all workEvaluations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} workEvaluation`;
  }

  update(id: number, updateWorkEvaluationDto: UpdateWorkEvaluationDto) {
    return `This action updates a #${id} workEvaluation`;
  }

  remove(id: number) {
    return `This action removes a #${id} workEvaluation`;
  }
}
