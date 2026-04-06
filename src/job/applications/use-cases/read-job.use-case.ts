import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  READ_COMPANY_REPOSITORY,
  type ReadCompanyRepositoryInterface,
} from '@src/company/applications/contracts/read-company.repository-interface';
import {
  READ_JOB_REPOSITORY,
  type ReadJobRepositoryInterface,
} from '@src/job/applications/contracts/read-job.repository-interface';
import type { ReadJobUseCaseInterface } from '@src/job/applications/contracts/read-job.use-case-interface';
import type { ReadJobResponseDto } from '@src/job/adapters/dto/responses/read-job.response.dto';
import MasksUtils from '@src/shared/applications/utils/masks.utils';

@Injectable()
export class ReadJobUseCase implements ReadJobUseCaseInterface {
  constructor(
    @Inject(READ_JOB_REPOSITORY)
    private readonly readJobRepository: ReadJobRepositoryInterface,
    @Inject(READ_COMPANY_REPOSITORY)
    private readonly readCompanyRepository: ReadCompanyRepositoryInterface,
  ) {}

  async execute(id: string): Promise<ReadJobResponseDto> {
    const job = await this.readJobRepository.findById(id);

    if (!job) {
      throw new NotFoundException('Job not found!');
    }

    const company = await this.readCompanyRepository.findById(job.companyId);

    if (!company) {
      throw new NotFoundException('Company not found!');
    }

    return {
      id: job.id,
      companyId: job.companyId,
      slug: job.slug,
      title: job.title,
      slots: job.slots,
      benefits: {
        ...job.benefits,
        salary:
          job.benefits.salary === null || job.benefits.salary === undefined
            ? null
            : MasksUtils.applyBrazilianSalaryMask(String(job.benefits.salary)),
      },
      isPaidAdvertising: job.isPaidAdvertising,
      role: job.role,
      status: job.status,
      company: {
        id: company.id,
        slug: company.slug,
        name: company.name,
        address: company.address,
        social: company.social ?? {},
        role: company.role,
        logo: company.logo ?? '',
        cover: company.cover ?? '',
        status: company.status,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt,
      },
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    };
  }
}
