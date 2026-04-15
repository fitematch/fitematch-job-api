import { ListCompanyUseCase } from '@src/company/applications/use-cases/list-company.use-case';
import type { ListCompanyRepositoryInterface } from '@src/company/applications/contracts/list-company.repository-interface';
import { CompanyRoleEnum } from '@src/company/domains/enums/company-role.enum';
import { CompanyStatusEnum } from '@src/company/domains/enums/company-status.enum';
import type { CompanyRecord } from '@src/company/applications/contracts/company-record.interface';

describe('ListCompanyUseCase', () => {
  let useCase: ListCompanyUseCase;
  let repository: jest.Mocked<ListCompanyRepositoryInterface>;

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

  beforeEach(() => {
    repository = {
      list: jest.fn(),
    };

    useCase = new ListCompanyUseCase(repository);
  });

  it('should list companies successfully', async () => {
    repository.list.mockResolvedValue(companies);

    const result = await useCase.execute();

    expect(repository.list.mock.calls).toHaveLength(1);
    expect(repository.list.mock.calls[0]).toEqual([]);
    expect(result).toEqual(companies);
  });

  it('should return an empty list when there are no companies', async () => {
    repository.list.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(repository.list.mock.calls).toHaveLength(1);
    expect(result).toEqual([]);
  });

  it('should propagate repository exceptions', async () => {
    const error = new Error('database unavailable');
    repository.list.mockRejectedValue(error);

    await expect(useCase.execute()).rejects.toThrow(error);
    expect(repository.list.mock.calls).toHaveLength(1);
  });
});
