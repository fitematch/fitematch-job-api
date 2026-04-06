import { NotFoundException } from '@nestjs/common';
import type { ReadCompanyRepositoryInterface } from '@src/company/applications/contracts/read-company.repository-interface';
import type { CompanyRecord } from '@src/company/applications/contracts/company-record.interface';
import { CompanyRoleEnum } from '@src/company/applications/contracts/company-role.enum';
import { CompanyStatusEnum } from '@src/company/applications/contracts/company-status.enum';
import type { UpdateJobPayload } from '@src/job/applications/contracts/job-payload.interface';
import type { JobRecord } from '@src/job/applications/contracts/job-record.interface';
import { JobRoleEnum } from '@src/job/applications/contracts/job-role.enum';
import { JobStatusEnum } from '@src/job/applications/contracts/job-status.enum';
import type { UpdateJobRepositoryInterface } from '@src/job/applications/contracts/update-job.repository-interface';
import { UpdateJobUseCase } from '@src/job/applications/use-cases/update-job.use-case';

describe('UpdateJobUseCase', () => {
  let useCase: UpdateJobUseCase;
  let repository: jest.Mocked<UpdateJobRepositoryInterface>;
  let companyRepository: jest.Mocked<ReadCompanyRepositoryInterface>;

  const jobBenefits = {
    salary: 2500,
    transportation: true,
    alimentation: true,
    health: true,
    parking: false,
    bonus: 'PLR trimestral',
  };

  const jobId = 'job-id';
  const updateInput: UpdateJobPayload = {
    title: 'Backend Freelance',
    slots: 5,
    role: JobRoleEnum.FREELANCE,
    status: JobStatusEnum.FREEZE,
  };

  const updatedJob: JobRecord = {
    id: jobId,
    companyId: 'company-id',
    slug: 'backend-intern',
    title: 'Backend Freelance',
    slots: 5,
    benefits: jobBenefits,
    role: JobRoleEnum.FREELANCE,
    status: JobStatusEnum.FREEZE,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-02T00:00:00.000Z'),
  };

  const companyRecord: CompanyRecord = {
    id: 'company-id',
    slug: 'tecfit',
    name: 'Tecfit',
    address: {
      street: 'Rua das Flores',
      number: '123',
      neighborhood: 'Centro',
      city: 'Sao Paulo',
      state: 'SP',
      country: 'Brasil',
    },
    social: {
      facebook: 'https://facebook.com/tecfit',
      instagram: 'https://instagram.com/tecfit',
      linkedin: 'https://linkedin.com/company/tecfit',
      twitter: 'https://x.com/tecfit',
    },
    role: CompanyRoleEnum.MAIN,
    logo: '/images/logo.png',
    cover: '/images/cover.png',
    status: CompanyStatusEnum.ACTIVE,
  };

  beforeEach(() => {
    repository = {
      update: jest.fn(),
    };
    companyRepository = {
      findById: jest.fn(),
    };

    useCase = new UpdateJobUseCase(repository, companyRepository);
  });

  it('should update a job successfully', async () => {
    repository.update.mockResolvedValue(updatedJob);
    companyRepository.findById.mockResolvedValue(companyRecord);

    const result = await useCase.execute(jobId, updateInput);

    expect(repository.update.mock.calls).toHaveLength(1);
    expect(repository.update.mock.calls[0]).toEqual([jobId, updateInput]);
    expect(companyRepository.findById.mock.calls[0]).toEqual([
      updatedJob.companyId,
    ]);
    expect(result).toEqual({
      ...updatedJob,
      company: {
        slug: companyRecord.slug,
        name: companyRecord.name,
        address: companyRecord.address,
        social: companyRecord.social,
        role: companyRecord.role,
        logo: companyRecord.logo,
        cover: companyRecord.cover,
        status: companyRecord.status,
      },
    });
  });

  it('should throw NotFoundException when the job does not exist', async () => {
    repository.update.mockResolvedValue(null);

    await expect(useCase.execute(jobId, updateInput)).rejects.toThrow(
      NotFoundException,
    );
    await expect(useCase.execute(jobId, updateInput)).rejects.toThrow(
      'Job not found!',
    );
    expect(repository.update.mock.calls[0]).toEqual([jobId, updateInput]);
  });

  it('should propagate repository exceptions', async () => {
    const error = new Error('database unavailable');
    repository.update.mockRejectedValue(error);

    await expect(useCase.execute(jobId, updateInput)).rejects.toThrow(error);
    expect(repository.update.mock.calls[0]).toEqual([jobId, updateInput]);
  });
});
