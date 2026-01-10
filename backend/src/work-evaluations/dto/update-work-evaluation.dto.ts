import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkEvaluationDto } from './create-work-evaluation.dto';

export class UpdateWorkEvaluationDto extends PartialType(CreateWorkEvaluationDto) {}
