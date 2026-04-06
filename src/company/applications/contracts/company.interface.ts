import type { CompanyRoleEnum } from './company-role.enum';
import type { CompanyStatusEnum } from './company-status.enum';

export type CompanyAddress = {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
};

export type CompanySocial = {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
};

export interface Company {
  slug: string;
  name: string;
  address: CompanyAddress;
  social: CompanySocial;
  role?: CompanyRoleEnum;
  logo?: string | null;
  cover?: string | null;
  status?: CompanyStatusEnum;
}
