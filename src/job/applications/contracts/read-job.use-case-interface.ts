import type { ReadJobResponseDto } from '@src/job/adapters/dto/responses/read-job.response.dto';

export const READ_JOB_USE_CASE = 'READ_JOB_USE_CASE';

export interface ReadJobUseCaseInterface {
  execute(id: string): Promise<ReadJobResponseDto>;
}
