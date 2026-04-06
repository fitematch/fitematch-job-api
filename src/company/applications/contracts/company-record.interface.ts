import type { CompanyAddress, CompanySocial } from './company.interface';
import type { CompanyRoleEnum } from './company-role.enum';
import type { CompanyStatusEnum } from './company-status.enum';

export interface CompanyRecord {
  id: string;
  slug: string;
  name: string;
  address: CompanyAddress;
  social: CompanySocial;
  role: CompanyRoleEnum;
  logo?: string | null;
  cover?: string | null;
  status: CompanyStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
}
