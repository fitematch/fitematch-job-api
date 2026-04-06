import type { ApplyStatusEnum } from './apply-status.enum';

export interface Apply {
  companyId: string;
  jobId: string;
  userId: string;
  status: ApplyStatusEnum;
}
