import { ConflictException } from '@nestjs/common';
import type { ReadCompanyRepositoryInterface } from '@src/company/applications/contracts/read-company.repository-interface';
import type { CompanyRecord } from '@src/company/applications/contracts/company-record.interface';
import { CompanyRoleEnum } from '@src/company/applications/contracts/company-role.enum';
import { CompanyStatusEnum } from '@src/company/applications/contracts/company-status.enum';
import type { CreateJobRepositoryInterface } from '@src/job/applications/contracts/create-job.repository-interface';
import type { JobPayload } from '@src/job/applications/contracts/job-payload.interface';
import type { JobRecord } from '@src/job/applications/contracts/job-record.interface';
import { JobRoleEnum } from '@src/job/applications/contracts/job-role.enum';
import { JobStatusEnum } from '@src/job/applications/contracts/job-status.enum';
import { CreateJobUseCase } from '@src/job/applications/use-cases/create-job.use-case';

describe('CreateJobUseCase', () => {
  let useCase: CreateJobUseCase;
  let repository: jest.Mocked<CreateJobRepositoryInterface>;
  let companyRepository: jest.Mocked<ReadCompanyRepositoryInterface>;

  const jobBenefits = {
    salary: 2500,
    transportation: true,
    alimentation: true,
    health: true,
    parking: false,
    bonus: 'PLR trimestral',
  };

  const jobInput: JobPayload = {
    companyId: 'company-id',
    slug: 'backend-intern',
    title: 'Backend Intern',
    slots: 3,
    benefits: jobBenefits,
    role: JobRoleEnum.INTERN,
    status: JobStatusEnum.ACTIVE,
  };

  const jobRecord: JobRecord = {
    id: 'job-id',
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
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  beforeEach(() => {
    repository = {
      create: jest.fn(),
    };
    companyRepository = {
      findById: jest.fn(),
    };

    useCase = new CreateJobUseCase(repository, companyRepository);
  });

  it('should create a job successfully', async () => {
    repository.create.mockResolvedValue(jobRecord);
    companyRepository.findById.mockResolvedValue(companyRecord);

    const result = await useCase.execute(jobInput);

    expect(repository.create.mock.calls).toHaveLength(1);
    expect(repository.create.mock.calls[0]).toEqual([jobInput]);
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

  it('should preserve all provided fields', async () => {
    const customJobInput: JobPayload = {
      ...jobInput,
      role: JobRoleEnum.FREELANCE,
      status: JobStatusEnum.FREEZE,
      slots: 5,
    };

    repository.create.mockResolvedValue({
      ...jobRecord,
      role: JobRoleEnum.FREELANCE,
      status: JobStatusEnum.FREEZE,
      slots: 5,
    });
    companyRepository.findById.mockResolvedValue(companyRecord);

    await useCase.execute(customJobInput);

    expect(repository.create.mock.calls[0]).toEqual([customJobInput]);
  });

  it('should propagate repository exceptions', async () => {
    const error = new ConflictException('slug already exists');
    repository.create.mockRejectedValue(error);

    await expect(useCase.execute(jobInput)).rejects.toThrow(error);
    expect(repository.create.mock.calls[0]).toEqual([jobInput]);
  });
});
