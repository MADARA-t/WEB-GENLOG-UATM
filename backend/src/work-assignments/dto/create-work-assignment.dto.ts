import { IsInt, IsString, IsOptional, ValidateIf } from 'class-validator';

export class CreateWorkAssignmentDto {
  @IsInt()
  workId: number;

  @IsInt()
  @IsOptional()
  @ValidateIf((o) => !o.groupName)
  studentId?: number;

  @IsString()
  @IsOptional()
  @ValidateIf((o) => !o.studentId)
  groupName?: string;
}