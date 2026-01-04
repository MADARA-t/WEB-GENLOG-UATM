import { PartialType } from '@nestjs/mapped-types';
import { CreatePedagogicalSpaceDto } from './create-pedagogical-space.dto';

export class UpdatePedagogicalSpaceDto extends PartialType(CreatePedagogicalSpaceDto) {}