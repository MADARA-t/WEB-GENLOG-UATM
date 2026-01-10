import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkAssignmentDto } from './create-work-assignment.dto';

export class UpdateWorkAssignmentDto extends PartialType(CreateWorkAssignmentDto) {}