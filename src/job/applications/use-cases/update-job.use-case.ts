import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  READ_COMPANY_REPOSITORY,
  type ReadCompanyRepositoryInterface,
} from '@src/company/applications/contracts/read-company.repository-interface';
import {
  UPDATE_JOB_REPOSITORY,
  type UpdateJobRepositoryInterface,
} from '@src/job/applications/contracts/update-job.repository-interface';
import type { UpdateJobPayload } from '@src/job/applications/contracts/job-payload.interface';
import type { UpdateJobUseCaseInterface } from '@src/job/applications/contracts/update-job.use-case-interface';
import type { Job } from '@src/job/applications/contracts/job.interface';

@Injectable()
export class UpdateJobUseCase implements UpdateJobUseCaseInterface {
  constructor(
    @Inject(UPDATE_JOB_REPOSITORY)
    private readonly updateJobRepository: UpdateJobRepositoryInterface,
    @Inject(READ_COMPANY_REPOSITORY)
    private readonly readCompanyRepository: ReadCompanyRepositoryInterface,
  ) {}

  async execute(id: string, data: UpdateJobPayload): Promise<Job> {
    const job = await this.updateJobRepository.update(id, data);

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
