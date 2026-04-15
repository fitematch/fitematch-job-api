import { UpdateCompanyUseCase } from '@src/company/applications/use-cases/update-company.use-case';
import type { UpdateCompanyRepositoryInterface } from '@src/company/applications/contracts/update-company.repository-interface';
import { CompanyRoleEnum } from '@src/company/domains/enums/company-role.enum';
import { CompanyStatusEnum } from '@src/company/domains/enums/company-status.enum';
import type { Company } from '@src/company/domains/entities/company.entity';
import type { CompanyRecord } from '@src/company/applications/contracts/company-record.interface';
import { NotFoundApplicationError } from '@src/shared/application/errors/not-found.application-error';

describe('UpdateCompanyUseCase', () => {
  let useCase: UpdateCompanyUseCase;
  let repository: jest.Mocked<UpdateCompanyRepositoryInterface>;

  const companyId = 'company-id';
  const updateInput: Partial<Company> = {
    name: 'Tecfit Updated',
    cover: '/images/updated-cover.png',
    status: CompanyStatusEnum.INACTIVE,
  };

  const updatedCompany: CompanyRecord = {
    id: companyId,
    slug: 'tecfit',
    name: 'Tecfit Updated',
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
    cover: '/images/updated-cover.png',
    status: CompanyStatusEnum.INACTIVE,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-02T00:00:00.000Z'),
  };

  beforeEach(() => {
    repository = {
      update: jest.fn(),
    };

    useCase = new UpdateCompanyUseCase(repository);
  });

  it('should update a company successfully', async () => {
    repository.update.mockResolvedValue(updatedCompany);

    const result = await useCase.execute(companyId, updateInput);

    expect(repository.update.mock.calls).toHaveLength(1);
    expect(repository.update.mock.calls[0]).toEqual([companyId, updateInput]);
    expect(result).toEqual(updatedCompany);
  });

  it('should throw NotFoundApplicationError when the company does not exist', async () => {
    repository.update.mockResolvedValue(null);

    await expect(useCase.execute(companyId, updateInput)).rejects.toThrow(
      NotFoundApplicationError,
    );
    await expect(useCase.execute(companyId, updateInput)).rejects.toThrow(
      'Company not found!',
    );
    expect(repository.update.mock.calls[0]).toEqual([companyId, updateInput]);
  });

  it('should propagate repository exceptions', async () => {
    const error = new Error('database unavailable');
    repository.update.mockRejectedValue(error);

    await expect(useCase.execute(companyId, updateInput)).rejects.toThrow(
      error,
    );
    expect(repository.update.mock.calls[0]).toEqual([companyId, updateInput]);
  });
});
