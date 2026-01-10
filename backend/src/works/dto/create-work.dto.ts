import { IsString, IsNotEmpty, IsEnum, IsInt, IsDateString, Min, Max, IsOptional } from 'class-validator';
import { WorkType } from '../entities/work.entity';

export class CreateWorkDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(WorkType)
  type: WorkType;

  @IsInt()
  spaceId: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  dueDate: string;

  @IsInt()
  @Min(0)
  @Max(100)
  points: number;

  @IsInt()
  createdBy: number;

  @IsString()
  @IsOptional()
attachmentUrl?: string;
}