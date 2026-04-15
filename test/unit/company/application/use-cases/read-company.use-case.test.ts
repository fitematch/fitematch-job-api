import { ReadCompanyUseCase } from '@src/company/applications/use-cases/read-company.use-case';
import type { ReadCompanyRepositoryInterface } from '@src/company/applications/contracts/read-company.repository-interface';
import { CompanyRoleEnum } from '@src/company/domains/enums/company-role.enum';
import { CompanyStatusEnum } from '@src/company/domains/enums/company-status.enum';
import type { CompanyRecord } from '@src/company/applications/contracts/company-record.interface';
import { NotFoundApplicationError } from '@src/shared/application/errors/not-found.application-error';

describe('ReadCompanyUseCase', () => {
  let useCase: ReadCompanyUseCase;
  let repository: jest.Mocked<ReadCompanyRepositoryInterface>;

  const companyId = 'company-id';
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
      findById: jest.fn(),
    };

    useCase = new ReadCompanyUseCase(repository);
  });

  it('should return a company when it exists', async () => {
    repository.findById.mockResolvedValue(companyRecord);

    const result = await useCase.execute(companyId);

    expect(repository.findById.mock.calls).toHaveLength(1);
    expect(repository.findById.mock.calls[0]).toEqual([companyId]);
    expect(result).toEqual(companyRecord);
  });

  it('should throw NotFoundApplicationError when the company does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(useCase.execute(companyId)).rejects.toThrow(
      NotFoundApplicationError,
    );
    await expect(useCase.execute(companyId)).rejects.toThrow(
      'Company not found!',
    );
    expect(repository.findById.mock.calls[0]).toEqual([companyId]);
  });

  it('should propagate repository exceptions', async () => {
    const error = new Error('database unavailable');
    repository.findById.mockRejectedValue(error);

    await expect(useCase.execute(companyId)).rejects.toThrow(error);
    expect(repository.findById.mock.calls[0]).toEqual([companyId]);
  });
});
