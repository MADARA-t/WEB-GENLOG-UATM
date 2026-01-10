import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WorkEvaluationsService } from './work-evaluations.service';
import { CreateWorkEvaluationDto } from './dto/create-work-evaluation.dto';
import { UpdateWorkEvaluationDto } from './dto/update-work-evaluation.dto';

@Controller('work-evaluations')
export class WorkEvaluationsController {
  constructor(private readonly workEvaluationsService: WorkEvaluationsService) {}

  @Post()
  create(@Body() createWorkEvaluationDto: CreateWorkEvaluationDto) {
    return this.workEvaluationsService.create(createWorkEvaluationDto);
  }

  @Get()
  findAll() {
    return this.workEvaluationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workEvaluationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkEvaluationDto: UpdateWorkEvaluationDto) {
    return this.workEvaluationsService.update(+id, updateWorkEvaluationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workEvaluationsService.remove(+id);
  }
}
