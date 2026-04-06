import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  LIST_COMPANY_REPOSITORY,
  type ListCompanyRepositoryInterface,
} from '@src/company/applications/contracts/list-company.repository-interface';
import type { ReadCompanyResponseDto } from '@src/company/adapters/dto/responses/read-company.response.dto';
import {
  LIST_JOB_REPOSITORY,
  type ListJobRepositoryInterface,
} from '@src/job/applications/contracts/list-job.repository-interface';
import type { ListJobUseCaseInterface } from '@src/job/applications/contracts/list-job.use-case-interface';
import type { ListJobResponseDto } from '@src/job/adapters/dto/responses/list-job.response.dto';
import MasksUtils from '@src/shared/applications/utils/masks.utils';

@Injectable()
export class ListJobUseCase implements ListJobUseCaseInterface {
  constructor(
    @Inject(LIST_JOB_REPOSITORY)
    private readonly listJobRepository: ListJobRepositoryInterface,
    @Inject(LIST_COMPANY_REPOSITORY)
    private readonly listCompanyRepository: ListCompanyRepositoryInterface,
  ) {}

  async execute(): Promise<ListJobResponseDto[]> {
    const [jobs, companies] = await Promise.all([
      this.listJobRepository.list(),
      this.listCompanyRepository.list(),
    ]);

    const companiesById = new Map<string, ReadCompanyResponseDto>(
      companies.map((company) => [
        company.id,
        {
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
      ]),
    );

    return jobs.map((job) => {
      const company = companiesById.get(job.companyId);

      if (!company) {
        throw new NotFoundException(
          `Company not found for job ${job.id} and companyId ${job.companyId}`,
        );
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
              : MasksUtils.applyBrazilianSalaryMask(
                  String(job.benefits.salary),
                ),
        },
        isPaidAdvertising: job.isPaidAdvertising,
        role: job.role,
        status: job.status,
        company,
        createdAt: job.createdAt,
        updatedAt: job.updatedAt,
      };
    });
  }
}
