import { NotFoundException } from '@nestjs/common';
import type { ReadCompanyRepositoryInterface } from '@src/company/applications/contracts/read-company.repository-interface';
import type { CompanyRecord } from '@src/company/applications/contracts/company-record.interface';
import { CompanyRoleEnum } from '@src/company/applications/contracts/company-role.enum';
import { CompanyStatusEnum } from '@src/company/applications/contracts/company-status.enum';
import type { ReadJobRepositoryInterface } from '@src/job/applications/contracts/read-job.repository-interface';
import type { JobRecord } from '@src/job/applications/contracts/job-record.interface';
import { JobRoleEnum } from '@src/job/applications/contracts/job-role.enum';
import { JobStatusEnum } from '@src/job/applications/contracts/job-status.enum';
import { ReadJobUseCase } from '@src/job/applications/use-cases/read-job.use-case';

describe('ReadJobUseCase', () => {
  let useCase: ReadJobUseCase;
  let repository: jest.Mocked<ReadJobRepositoryInterface>;
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
  const jobRecord: JobRecord = {
    id: jobId,
    companyId: 'company-id',
    slug: 'backend-intern',
    title: 'Backend Intern',
    slots: 3,
    benefits: jobBenefits,
    role: JobRoleEnum.INTERN,
    status: JobStatusEnum.ACTIVE,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
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
      findById: jest.fn(),
    };
    companyRepository = {
      findById: jest.fn(),
    };

    useCase = new ReadJobUseCase(repository, companyRepository);
  });

  it('should return a job when it exists', async () => {
    repository.findById.mockResolvedValue(jobRecord);
    companyRepository.findById.mockResolvedValue(companyRecord);

    const result = await useCase.execute(jobId);

    expect(repository.findById.mock.calls).toHaveLength(1);
    expect(repository.findById.mock.calls[0]).toEqual([jobId]);
    expect(companyRepository.findById.mock.calls[0]).toEqual([
      jobRecord.companyId,
    ]);
    expect(result).toEqual({
      ...jobRecord,
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
    repository.findById.mockResolvedValue(null);

    await expect(useCase.execute(jobId)).rejects.toThrow(NotFoundException);
    await expect(useCase.execute(jobId)).rejects.toThrow('Job not found!');
    expect(repository.findById.mock.calls[0]).toEqual([jobId]);
  });

  it('should propagate repository exceptions', async () => {
    const error = new Error('database unavailable');
    repository.findById.mockRejectedValue(error);

    await expect(useCase.execute(jobId)).rejects.toThrow(error);
    expect(repository.findById.mock.calls[0]).toEqual([jobId]);
  });
});
