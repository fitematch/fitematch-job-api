import type { Company } from '@src/company/domains/entities/company.entity';
import type { CompanyRecord } from '@src/company/applications/contracts/company-record.interface';

export const UPDATE_COMPANY_REPOSITORY_INTERFACE =
  'UPDATE_COMPANY_REPOSITORY_INTERFACE';

export interface UpdateCompanyRepositoryInterface {
  update(id: string, data: Partial<Company>): Promise<CompanyRecord | null>;
}
