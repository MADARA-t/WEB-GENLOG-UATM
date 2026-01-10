import { Injectable } from '@nestjs/common';
import { CreateWorkSubmissionDto } from './dto/create-work-submission.dto';
import { UpdateWorkSubmissionDto } from './dto/update-work-submission.dto';

@Injectable()
export class WorkSubmissionsService {
  create(createWorkSubmissionDto: CreateWorkSubmissionDto) {
    return 'This action adds a new workSubmission';
  }

  findAll() {
    return `This action returns all workSubmissions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} workSubmission`;
  }

  update(id: number, updateWorkSubmissionDto: UpdateWorkSubmissionDto) {
    return `This action updates a #${id} workSubmission`;
  }

  remove(id: number) {
    return `This action removes a #${id} workSubmission`;
  }
}
