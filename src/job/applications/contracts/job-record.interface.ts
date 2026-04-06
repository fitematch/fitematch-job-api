import type { JobBenefits } from './job.interface';
import type { JobRoleEnum } from './job-role.enum';
import type { JobStatusEnum } from './job-status.enum';

export interface JobRecord {
  id: string;
  companyId: string;
  slug: string;
  title: string;
  slots: number;
  benefits: JobBenefits;
  isPaidAdvertising?: boolean;
  role: JobRoleEnum;
  status: JobStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
}
