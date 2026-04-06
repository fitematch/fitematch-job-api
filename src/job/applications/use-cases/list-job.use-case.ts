import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  LIST_COMPANY_REPOSITORY,
  type ListCompanyRepositoryInterface,
} from '@src/company/applications/contracts/list-company.repository-interface';
import type { Company } from '@src/company/applications/contracts/company.interface';
import {
  LIST_JOB_REPOSITORY,
  type ListJobRepositoryInterface,
} from '@src/job/applications/contracts/list-job.repository-interface';
import type { Job } from '@src/job/applications/contracts/job.interface';
import type { ListJobUseCaseInterface } from '@src/job/applications/contracts/list-job.use-case-interface';

@Injectable()
export class ListJobUseCase implements ListJobUseCaseInterface {
  constructor(
    @Inject(LIST_JOB_REPOSITORY)
    private readonly listJobRepository: ListJobRepositoryInterface,
    @Inject(LIST_COMPANY_REPOSITORY)
    private readonly listCompanyRepository: ListCompanyRepositoryInterface,
  ) {}

  async execute(): Promise<Job[]> {
    const [jobs, companies] = await Promise.all([
      this.listJobRepository.list(),
      this.listCompanyRepository.list(),
    ]);

    const companiesById = new Map<string, Company>(
      companies.map((company) => [
        company.id,
        {
          slug: company.slug,
          name: company.name,
          address: company.address,
          social: company.social ?? {},
          role: company.role,
          logo: company.logo ?? '',
          cover: company.cover ?? '',
          status: company.status,
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
        benefits: job.benefits,
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
