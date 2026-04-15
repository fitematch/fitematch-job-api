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
  let repository: ReadJobRepositoryInterface;
  let companyRepository: ReadCompanyRepositoryInterface;
  let findJobByIdSpy: jest.SpiedFunction<
    ReadJobRepositoryInterface['findById']
  >;
  let findCompanyByIdSpy: jest.SpiedFunction<
    ReadCompanyRepositoryInterface['findById']
  >;

  const jobId = 'job-id';
  const companyId = 'company-id';

  const jobRecord: JobRecord = {
    id: jobId,
    companyId,
    isPaidAdvertising: true,
    slug: 'backend-intern',
    title: 'Backend Intern',
    slots: 3,
    cover: '/images/jobs/backend-intern.png',
    benefits: {
      salary: 2500,
      transportation: true,
      alimentation: true,
      health: true,
      parking: false,
      bonus: 'PLR trimestral',
    },
    role: JobRoleEnum.INTERN,
    status: JobStatusEnum.ACTIVE,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  const companyRecord: CompanyRecord = {
    id: companyId,
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
      findById: () => Promise.resolve(null),
    };
    companyRepository = {
      findById: () => Promise.resolve(null),
    };
    findJobByIdSpy = jest.spyOn(repository, 'findById');
    findCompanyByIdSpy = jest.spyOn(companyRepository, 'findById');

    useCase = new ReadJobUseCase(repository, companyRepository);
  });

  describe('execute', () => {
    it('should return a job with company details and formatted salary', async () => {
      findJobByIdSpy.mockResolvedValue(jobRecord);
      findCompanyByIdSpy.mockResolvedValue(companyRecord);

      const result = await useCase.execute(jobId);

      expect(findJobByIdSpy.mock.calls).toEqual([[jobId]]);
      expect(findCompanyByIdSpy.mock.calls).toEqual([[companyId]]);
      expect(result).toEqual({
        ...jobRecord,
        benefits: {
          ...jobRecord.benefits,
          salary: 'R$\u00A02.500,00',
        },
        company: {
          id: companyRecord.id,
          slug: companyRecord.slug,
          name: companyRecord.name,
          address: companyRecord.address,
          social: companyRecord.social,
          role: companyRecord.role,
          logo: companyRecord.logo,
          cover: companyRecord.cover,
          status: companyRecord.status,
          createdAt: companyRecord.createdAt,
          updatedAt: companyRecord.updatedAt,
        },
      });
    });

    it('should normalize nullable company fields and salary when absent', async () => {
      findJobByIdSpy.mockResolvedValue({
        ...jobRecord,
        isPaidAdvertising: undefined,
        cover: '',
        benefits: {
          ...jobRecord.benefits,
          salary: null,
        },
      });
      findCompanyByIdSpy.mockResolvedValue({
        ...companyRecord,
        social: {} as CompanyRecord['social'],
        logo: undefined,
        cover: undefined,
      });

      const result = await useCase.execute(jobId);

      expect(result.benefits.salary).toBeNull();
      expect(result.company.social).toEqual({});
      expect(result.company.logo).toBe('');
      expect(result.company.cover).toBe('');
    });

    it('should throw NotFoundException when the job does not exist', async () => {
      findJobByIdSpy.mockResolvedValue(null);

      await expect(useCase.execute(jobId)).rejects.toThrow(
        new NotFoundException('Job not found!'),
      );
      expect(findJobByIdSpy.mock.calls).toEqual([[jobId]]);
      expect(findCompanyByIdSpy.mock.calls).toEqual([]);
    });

    it('should throw NotFoundException when the company does not exist', async () => {
      findJobByIdSpy.mockResolvedValue(jobRecord);
      findCompanyByIdSpy.mockResolvedValue(null);

      await expect(useCase.execute(jobId)).rejects.toThrow(
        new NotFoundException('Company not found!'),
      );
      expect(findJobByIdSpy.mock.calls).toEqual([[jobId]]);
      expect(findCompanyByIdSpy.mock.calls).toEqual([[companyId]]);
    });

    it('should propagate repository exceptions', async () => {
      const error = new Error('database unavailable');
      findJobByIdSpy.mockRejectedValue(error);

      await expect(useCase.execute(jobId)).rejects.toThrow(error);
      expect(findJobByIdSpy.mock.calls).toEqual([[jobId]]);
    });
  });
});
