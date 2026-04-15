import { type UpdateCompanyRepositoryInterface } from '@src/company/applications/contracts/update-company.repository-interface';
import type { UpdateCompanyUseCaseInterface } from '@src/company/applications/contracts/update-company.use-case-interface';
import {
  CompanyEntity,
  type Company,
} from '@src/company/domains/entities/company.entity';
import type { CompanyRecord } from '@src/company/applications/contracts/company-record.interface';
import { NotFoundApplicationError } from '@src/shared/application/errors/not-found.application-error';

export class UpdateCompanyUseCase implements UpdateCompanyUseCaseInterface {
  constructor(
    private readonly updateCompanyRepository: UpdateCompanyRepositoryInterface,
  ) {}

  async execute(id: string, data: Partial<Company>): Promise<CompanyRecord> {
    const company = await this.updateCompanyRepository.update(
      id,
      CompanyEntity.normalizeUpdate(data),
    );

    if (!company) {
      throw new NotFoundApplicationError('Company not found!');
    }

    return company;
  }
}
