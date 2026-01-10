import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkSubmissionDto } from './create-work-submission.dto';

export class UpdateWorkSubmissionDto extends PartialType(CreateWorkSubmissionDto) {}
