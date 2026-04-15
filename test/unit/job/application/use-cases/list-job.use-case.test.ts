import type { ListCompanyRepositoryInterface } from '@src/company/applications/contracts/list-company.repository-interface';
import type { CompanyRecord } from '@src/company/applications/contracts/company-record.interface';
import { CompanyRoleEnum } from '@src/company/applications/contracts/company-role.enum';
import { CompanyStatusEnum } from '@src/company/applications/contracts/company-status.enum';
import type {
  ListJobRepositoryInterface,
  ListJobRepositoryResult,
} from '@src/job/applications/contracts/list-job.repository-interface';
import type { JobRecord } from '@src/job/applications/contracts/job-record.interface';
import { JobRoleEnum } from '@src/job/applications/contracts/job-role.enum';
import { JobStatusEnum } from '@src/job/applications/contracts/job-status.enum';
import { ListJobUseCase } from '@src/job/applications/use-cases/list-job.use-case';
import type { ResultListJobUseCaseInterface } from '@src/job/applications/contracts/result-list-job.use-case.interface';
import type { DataListJobsUseCaseInterface } from '@src/job/applications/contracts/list-job.use-case-interface';
import type MetadataUtils from '@src/shared/applications/utils/metadata.utils';

describe('ListJobUseCase', () => {
  let useCase: ListJobUseCase;
  let repository: {
    list: jest.MockedFunction<ListJobRepositoryInterface['list']>;
  };
  let companyRepository: {
    list: jest.MockedFunction<ListCompanyRepositoryInterface['list']>;
  };
  let metadataUtils: {
    getDadosPaginacao: jest.MockedFunction<MetadataUtils['getDadosPaginacao']>;
  };

  const filters: DataListJobsUseCaseInterface = {
    route: '/jobs',
  };

  const firstJobBenefits = {
    salary: 2500,
    transportation: true,
    alimentation: true,
    health: true,
    parking: false,
    bonus: 'PLR trimestral',
  };

  const secondJobBenefits = {
    salary: 0,
    transportation: true,
    alimentation: false,
    health: false,
    parking: true,
    bonus: 'Bonus por entrega',
  };

  const jobs: JobRecord[] = [
    {
      id: 'job-1',
      companyId: 'company-1',
      isPaidAdvertising: true,
      slug: 'backend-intern',
      title: 'Backend Intern',
      slots: 3,
      cover: '/images/jobs/backend-intern.png',
      benefits: firstJobBenefits,
      role: JobRoleEnum.INTERN,
      status: JobStatusEnum.ACTIVE,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    },
    {
      id: 'job-2',
      companyId: 'company-2',
      isPaidAdvertising: false,
      slug: 'designer-contract',
      title: 'Designer Contract',
      slots: 1,
      cover: '/images/jobs/designer-contract.png',
      benefits: secondJobBenefits,
      role: JobRoleEnum.CONTRACT_PERSON,
      status: JobStatusEnum.CANCELLED,
      createdAt: new Date('2026-01-02T00:00:00.000Z'),
      updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    },
  ];

  const companies: CompanyRecord[] = [
    {
      id: 'company-1',
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
      logo: '/images/tecfit.png',
      cover: '/images/tecfit-cover.png',
      status: CompanyStatusEnum.ACTIVE,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    },
    {
      id: 'company-2',
      slug: 'studio-fit',
      name: 'Studio Fit',
      address: {
        street: 'Avenida Paulista',
        number: '500',
        neighborhood: 'Bela Vista',
        city: 'Sao Paulo',
        state: 'SP',
        country: 'Brasil',
      },
      social: {
        facebook: 'https://facebook.com/studiofit',
        instagram: 'https://instagram.com/studiofit',
        linkedin: 'https://linkedin.com/company/studiofit',
        twitter: 'https://x.com/studiofit',
      },
      role: CompanyRoleEnum.AFFILIATE,
      logo: '/images/studio-fit.png',
      cover: '/images/studio-fit-cover.png',
      status: CompanyStatusEnum.INACTIVE,
      createdAt: new Date('2026-01-02T00:00:00.000Z'),
      updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    },
  ];

  const repositoryResult: ListJobRepositoryResult = {
    data: jobs,
    totalItems: 2,
    currentPage: 1,
    itemsPerPage: 10,
  };

  const paginationMetadata = {
    totalItems: 2,
    itemCount: 2,
    itemsPerPage: 10,
    totalPages: 1,
    currentPage: 1,
    hasNextPage: false,
    hasPreviousPage: false,
    links: {
      first: '/jobs?limit=10',
      previous: '',
      next: '',
      last: '/jobs?page=1&limit=10',
    },
  };

  const expectedResult: ResultListJobUseCaseInterface = {
    data: [
      {
        ...jobs[0],
        benefits: {
          ...jobs[0].benefits,
          salary: 'R$\u00A02.500,00',
        },
        company: {
          id: 'company-1',
          slug: 'tecfit',
          name: 'Tecfit',
          address: companies[0].address,
          social: companies[0].social,
          role: CompanyRoleEnum.MAIN,
          logo: '/images/tecfit.png',
          cover: '/images/tecfit-cover.png',
          status: CompanyStatusEnum.ACTIVE,
          createdAt: companies[0].createdAt,
          updatedAt: companies[0].updatedAt,
        },
      },
      {
        ...jobs[1],
        benefits: {
          ...jobs[1].benefits,
          salary: 'R$\u00A00,00',
        },
        company: {
          id: 'company-2',
          slug: 'studio-fit',
          name: 'Studio Fit',
          address: companies[1].address,
          social: companies[1].social,
          role: CompanyRoleEnum.AFFILIATE,
          logo: '/images/studio-fit.png',
          cover: '/images/studio-fit-cover.png',
          status: CompanyStatusEnum.INACTIVE,
          createdAt: companies[1].createdAt,
          updatedAt: companies[1].updatedAt,
        },
      },
    ],
    metadata: {
      pagination: paginationMetadata,
    },
  };

  beforeEach(() => {
    repository = {
      list: jest.fn(),
    };
    companyRepository = {
      list: jest.fn(),
    };
    metadataUtils = {
      getDadosPaginacao: jest.fn().mockReturnValue(paginationMetadata),
    };

    useCase = new ListJobUseCase(repository, companyRepository, metadataUtils);
  });

  describe('execute', () => {
    it('should list jobs successfully', async () => {
      repository.list.mockResolvedValue(repositoryResult);
      companyRepository.list.mockResolvedValue(companies);

      const result = await useCase.execute(filters);

      expect(repository.list.mock.calls).toEqual([[filters]]);
      expect(companyRepository.list.mock.calls).toEqual([[]]);
      expect(metadataUtils.getDadosPaginacao.mock.calls).toEqual([
        [2, 2, 10, 1, '/jobs'],
      ]);
      expect(result).toEqual(expectedResult);
    });

    it('should normalize nullable company fields and salary values', async () => {
      repository.list.mockResolvedValue({
        data: [
          {
            ...jobs[0],
            benefits: {
              ...jobs[0].benefits,
              salary: null,
            },
          },
        ],
        totalItems: 1,
        currentPage: 1,
        itemsPerPage: 10,
      });
      companyRepository.list.mockResolvedValue([
        {
          ...companies[0],
          social: {} as CompanyRecord['social'],
          logo: undefined,
          cover: undefined,
        },
      ]);

      const result = await useCase.execute(filters);

      expect(result.data[0].benefits.salary).toBeNull();
      expect(result.data[0].company.social).toEqual({});
      expect(result.data[0].company.logo).toBe('');
      expect(result.data[0].company.cover).toBe('');
    });

    it('should return null salary when the job salary is undefined', async () => {
      repository.list.mockResolvedValue({
        data: [
          {
            ...jobs[0],
            benefits: {
              ...jobs[0].benefits,
              salary: undefined,
            },
          },
        ],
        totalItems: 1,
        currentPage: 1,
        itemsPerPage: 10,
      });
      companyRepository.list.mockResolvedValue([companies[0]]);

      const result = await useCase.execute(filters);

      expect(result.data[0].benefits.salary).toBeNull();
    });

    it('should return an empty list when there are no jobs', async () => {
      repository.list.mockResolvedValue({
        data: [],
        totalItems: 0,
        currentPage: 1,
        itemsPerPage: 10,
      });
      companyRepository.list.mockResolvedValue(companies);

      const result = await useCase.execute(filters);

      expect(repository.list.mock.calls).toEqual([[filters]]);
      expect(metadataUtils.getDadosPaginacao.mock.calls).toEqual([]);
      expect(result).toEqual({
        data: [],
        metadata: {
          pagination: {
            totalItems: 0,
            itemCount: 0,
            itemsPerPage: 10,
            totalPages: 0,
            currentPage: 1,
            hasNextPage: false,
            hasPreviousPage: false,
            links: {
              first: '/jobs',
              previous: '',
              next: '',
              last: '',
            },
          },
        },
      });
    });

    it('should return empty metadata using provided pagination filters', async () => {
      repository.list.mockResolvedValue({
        data: [],
        totalItems: 0,
        currentPage: 3,
        itemsPerPage: 25,
      });
      companyRepository.list.mockResolvedValue(companies);

      const result = await useCase.execute({
        route: '/jobs',
        page: 3,
        limit: 25,
      });

      expect(result.metadata.pagination).toEqual({
        totalItems: 0,
        itemCount: 0,
        itemsPerPage: 25,
        totalPages: 0,
        currentPage: 3,
        hasNextPage: false,
        hasPreviousPage: false,
        links: {
          first: '/jobs',
          previous: '',
          next: '',
          last: '',
        },
      });
    });

    it('should throw NotFoundException when a company for a job is missing', async () => {
      repository.list.mockResolvedValue({
        data: [jobs[0]],
        totalItems: 1,
        currentPage: 1,
        itemsPerPage: 10,
      });
      companyRepository.list.mockResolvedValue([]);

      await expect(useCase.execute(filters)).rejects.toThrow(
        `Company not found for job ${jobs[0].id} and companyId ${jobs[0].companyId}`,
      );
      expect(metadataUtils.getDadosPaginacao.mock.calls).toEqual([]);
    });

    it('should propagate repository exceptions', async () => {
      const error = new Error('database unavailable');
      repository.list.mockRejectedValue(error);

      await expect(useCase.execute(filters)).rejects.toThrow(error);
      expect(repository.list.mock.calls).toEqual([[filters]]);
    });
  });
});
