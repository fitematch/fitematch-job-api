import type { Company } from '@src/company/domains/entities/company.entity';
import type { CompanyRecord } from '@src/company/applications/contracts/company-record.interface';

export const UPDATE_COMPANY_USE_CASE_INTERFACE =
  'UPDATE_COMPANY_USE_CASE_INTERFACE';

export interface UpdateCompanyUseCaseInterface {
  execute(id: string, data: Partial<Company>): Promise<CompanyRecord>;
}
