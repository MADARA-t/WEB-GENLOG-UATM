import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreatePedagogicalSpaceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  promotionId: number;

  @IsNumber()
  @IsOptional()
  formateurId?: number;

  @IsNumber()
  @IsOptional()
  technicienId?: number;
}