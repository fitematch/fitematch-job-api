import type { ListJobResponseDto } from '@src/job/adapters/dto/responses/list-job.response.dto';

export const LIST_JOB_USE_CASE = 'LIST_JOB_USE_CASE';

export interface ListJobUseCaseInterface {
  execute(): Promise<ListJobResponseDto[]>;
}
