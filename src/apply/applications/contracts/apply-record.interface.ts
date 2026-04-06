import type { ApplyStatusEnum } from './apply-status.enum';

export interface ApplyRecord {
  id: string;
  companyId: string;
  jobId: string;
  userId: string;
  status: ApplyStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
}
