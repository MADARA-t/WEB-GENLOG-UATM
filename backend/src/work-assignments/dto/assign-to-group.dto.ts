import { IsInt, IsString, IsArray } from 'class-validator';

export class AssignToGroupDto {
  @IsInt()
  workId: number;

  @IsString()
  groupName: string;

  @IsArray()
  @IsInt({ each: true })
  studentIds: number[];
}