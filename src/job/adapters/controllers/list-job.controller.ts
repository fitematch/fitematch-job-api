import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListJobResponseDto } from '@src/job/adapters/dto/responses/list-job.response.dto';
import {
  LIST_JOB_USE_CASE,
  type ListJobUseCaseInterface,
} from '@src/job/applications/contracts/list-job.use-case-interface';

@ApiTags('Job')
@Controller('job')
export class ListJobController {
  constructor(
    @Inject(LIST_JOB_USE_CASE)
    private readonly listJobUseCase: ListJobUseCaseInterface,
  ) {}

  @ApiOperation({
    summary: 'List jobs',
    description: 'Returns the list of registered jobs.',
  })
  @ApiOkResponse({
    description: 'Jobs listed successfully.',
    type: ListJobResponseDto,
    isArray: true,
  })
  @Get()
  async list(): Promise<ListJobResponseDto[]> {
    return this.listJobUseCase.execute();
  }
}
