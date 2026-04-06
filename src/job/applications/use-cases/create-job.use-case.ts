import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  READ_COMPANY_REPOSITORY,
  type ReadCompanyRepositoryInterface,
} from '@src/company/applications/contracts/read-company.repository-interface';
import {
  CREATE_JOB_REPOSITORY,
  type CreateJobRepositoryInterface,
} from '@src/job/applications/contracts/create-job.repository-interface';
import type { CreateJobUseCaseInterface } from '@src/job/applications/contracts/create-job.use-case-interface';
import type { JobPayload } from '@src/job/applications/contracts/job-payload.interface';
import type { Job } from '@src/job/applications/contracts/job.interface';

@Injectable()
export class CreateJobUseCase implements CreateJobUseCaseInterface {
  constructor(
    @Inject(CREATE_JOB_REPOSITORY)
    private readonly createJobRepository: CreateJobRepositoryInterface,
    @Inject(READ_COMPANY_REPOSITORY)
    private readonly readCompanyRepository: ReadCompanyRepositoryInterface,
  ) {}

  async execute(data: JobPayload): Promise<Job> {
    const job = await this.createJobRepository.create({
      ...data,
    });

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
      benefits: job.benefits,
      isPaidAdvertising: job.isPaidAdvertising,
      role: job.role,
      status: job.status,
      company: {
        slug: company.slug,
        name: company.name,
        address: company.address,
        social: company.social ?? {},
        role: company.role,
        logo: company.logo ?? '',
        cover: company.cover ?? '',
        status: company.status,
      },
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    };
  }
}
