import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WorkSubmissionsService } from './work-submissions.service';
import { CreateWorkSubmissionDto } from './dto/create-work-submission.dto';
import { UpdateWorkSubmissionDto } from './dto/update-work-submission.dto';

@Controller('work-submissions')
export class WorkSubmissionsController {
  constructor(private readonly workSubmissionsService: WorkSubmissionsService) {}

  @Post()
  create(@Body() createWorkSubmissionDto: CreateWorkSubmissionDto) {
    return this.workSubmissionsService.create(createWorkSubmissionDto);
  }

  @Get()
  findAll() {
    return this.workSubmissionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workSubmissionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkSubmissionDto: UpdateWorkSubmissionDto) {
    return this.workSubmissionsService.update(+id, updateWorkSubmissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workSubmissionsService.remove(+id);
  }
}
