import { type CreateCompanyRepositoryInterface } from '@src/company/applications/contracts/create-company.repository-interface';
import type { CreateCompanyUseCaseInterface } from '@src/company/applications/contracts/create-company.use-case-interface';
import {
  CompanyEntity,
  type Company,
} from '@src/company/domains/entities/company.entity';
import type { CompanyRecord } from '@src/company/applications/contracts/company-record.interface';

export class CreateCompanyUseCase implements CreateCompanyUseCaseInterface {
  constructor(
    private readonly createCompanyRepository: CreateCompanyRepositoryInterface,
  ) {}

  async execute(data: Company): Promise<CompanyRecord> {
    const company = CompanyEntity.create(data);

    return this.createCompanyRepository.create(company.toPrimitives());
  }
}
