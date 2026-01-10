import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { WorkAssignmentsService } from './work-assignments.service';
import { CreateWorkAssignmentDto } from './dto/create-work-assignment.dto';
import { UpdateWorkAssignmentDto } from './dto/update-work-assignment.dto';
import { AssignToGroupDto } from './dto/assign-to-group.dto';

@Controller('work-assignments')
export class WorkAssignmentsController {
  constructor(private readonly assignmentsService: WorkAssignmentsService) {}

  @Post()
  create(@Body() createDto: CreateWorkAssignmentDto) {
    return this.assignmentsService.create(createDto);
  }

  @Post('group')
  assignToGroup(@Body() assignToGroupDto: AssignToGroupDto) {
    return this.assignmentsService.assignToGroup(assignToGroupDto);
  }

  @Get()
  findAll(
    @Query('workId') workId?: string,
    @Query('studentId') studentId?: string,
    @Query('spaceId') spaceId?: string,
  ) {
    if (workId) {
      return this.assignmentsService.findByWork(Number(workId));
    }
    if (studentId) {
      return this.assignmentsService.findByStudent(Number(studentId));
    }
    if (spaceId) {
      return this.assignmentsService.findBySpace(Number(spaceId));
    }
    return this.assignmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assignmentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateWorkAssignmentDto) {
    return this.assignmentsService.update(+id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assignmentsService.remove(+id);
  }

  @Delete('work/:workId/student/:studentId')
  removeByWorkAndStudent(
    @Param('workId') workId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.assignmentsService.removeByWorkAndStudent(+workId, +studentId);
  }
}