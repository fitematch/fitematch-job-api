import type { ConfigService } from '@nestjs/config';
import { JobResponseMapper } from '@src/job/adapters/controllers/responses/job-response.mapper';
import type {
  ListJobsOutput,
  JobOutput,
} from '@src/job/applications/contracts/job-output.interface';
import { JobRoleEnum } from '@src/job/domain/enums/job-role.enum';
import { JobStatusEnum } from '@src/job/domain/enums/job-status.enum';
import { HttpPaginationMapper } from '@src/shared/presentation/http/pagination/http-pagination.mapper';

describe('JobResponseMapper', () => {
  let mapper: JobResponseMapper;
  let httpPaginationMapper: HttpPaginationMapper;
  let configService: { get: jest.MockedFunction<ConfigService['get']> };

  const jobOutput: JobOutput = {
    id: 'job-id',
    companyId: 'company-id',
    slug: 'backend-intern',
    title: 'Backend Intern',
    slots: 3,
    cover: '/images/job.png',
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
    company: {
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
      social: {},
      role: 'main',
      logo: '',
      cover: '',
      status: 'active',
    },
  };

  beforeEach(() => {
    httpPaginationMapper = new HttpPaginationMapper();
    configService = {
      get: jest.fn().mockReturnValue('http://localhost:3000'),
    };
    mapper = new JobResponseMapper(
      httpPaginationMapper,
      configService as unknown as ConfigService,
    );
  });

  it('should format salary in a single response', () => {
    expect(mapper.toResponse(jobOutput).benefits.salary).toBe(
      'R$\u00A02.500,00',
    );
  });

  it('should build list response metadata and map items', () => {
    const output: ListJobsOutput = {
      data: [jobOutput],
      pagination: {
        totalItems: 1,
        itemCount: 1,
        itemsPerPage: 10,
        totalPages: 1,
        currentPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };

    const result = mapper.toListResponse(output);

    expect(configService.get.mock.calls).toEqual([['JOB_API_URL']]);
    expect(result.data).toHaveLength(1);
    expect(result.metadata.pagination?.links.first).toBe(
      'http://localhost:3000/job?limit=10',
    );
  });
});
