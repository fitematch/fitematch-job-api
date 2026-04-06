import type { JobRoleEnum } from './job-role.enum';
import type { JobStatusEnum } from './job-status.enum';
import type { Company } from '@src/company/applications/contracts/company.interface';

export type JobBenefits = {
  salary?: number | null;
  transportation: boolean;
  alimentation: boolean;
  health: boolean;
  parking: boolean;
  bonus: string;
};

export interface Job {
  id?: string;
  companyId: string;
  slug: string;
  title: string;
  slots: number;
  benefits: JobBenefits;
  isPaidAdvertising?: boolean;
  role: JobRoleEnum;
  status: JobStatusEnum;
  company: Company;
  createdAt?: Date;
  updatedAt?: Date;
}
