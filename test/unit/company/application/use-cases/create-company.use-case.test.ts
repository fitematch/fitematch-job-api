import { CreateCompanyUseCase } from '@src/company/applications/use-cases/create-company.use-case';
import type { CreateCompanyRepositoryInterface } from '@src/company/applications/contracts/create-company.repository-interface';
import { CompanyRoleEnum } from '@src/company/domains/enums/company-role.enum';
import { CompanyStatusEnum } from '@src/company/domains/enums/company-status.enum';
import type { Company } from '@src/company/domains/entities/company.entity';
import type { CompanyRecord } from '@src/company/applications/contracts/company-record.interface';
import { ConflictApplicationError } from '@src/shared/application/errors/conflict.application-error';

describe('CreateCompanyUseCase', () => {
  let useCase: CreateCompanyUseCase;
  let repository: jest.Mocked<CreateCompanyRepositoryInterface>;

  const companyInput: Company = {
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
    logo: '/images/logo.png',
    cover: '/images/cover.png',
  };

  const companyRecord: CompanyRecord = {
    id: 'company-id',
    slug: 'tecfit',
    name: 'Tecfit',
    address: companyInput.address,
    social: companyInput.social,
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

    useCase = new CreateCompanyUseCase(repository);
  });

  it('should create a company successfully', async () => {
    repository.create.mockResolvedValue(companyRecord);

    const result = await useCase.execute(companyInput);

    expect(repository.create.mock.calls).toHaveLength(1);
    expect(repository.create.mock.calls[0]).toEqual([
      {
        ...companyInput,
        role: CompanyRoleEnum.MAIN,
        status: CompanyStatusEnum.ACTIVE,
      },
    ]);
    expect(result).toEqual(companyRecord);
  });

  it('should preserve optional fields when provided', async () => {
    const inputWithOptionalFields: Company = {
      ...companyInput,
      role: CompanyRoleEnum.AFFILIATE,
      status: CompanyStatusEnum.INACTIVE,
    };

    repository.create.mockResolvedValue({
      ...companyRecord,
      role: CompanyRoleEnum.AFFILIATE,
      status: CompanyStatusEnum.INACTIVE,
    });

    await useCase.execute(inputWithOptionalFields);

    expect(repository.create.mock.calls[0]).toEqual([inputWithOptionalFields]);
  });

  it('should propagate repository exceptions', async () => {
    const error = new ConflictApplicationError('slug already exists');
    repository.create.mockRejectedValue(error);

    await expect(useCase.execute(companyInput)).rejects.toThrow(error);
    expect(repository.create.mock.calls[0]).toEqual([
      {
        ...companyInput,
        role: CompanyRoleEnum.MAIN,
        status: CompanyStatusEnum.ACTIVE,
      },
    ]);
  });
});
