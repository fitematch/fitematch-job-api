import type { Company } from '@src/company/domains/entities/company.entity';
import type { CompanyRecord } from '@src/company/applications/contracts/company-record.interface';

export const CREATE_COMPANY_USE_CASE_INTERFACE =
  'CREATE_COMPANY_USE_CASE_INTERFACE';

export interface CreateCompanyUseCaseInterface {
  execute(data: Company): Promise<CompanyRecord>;
}
