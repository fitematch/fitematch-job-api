import { CompanyResponseMapper } from '@src/company/adapters/controllers/responses/company-response.mapper';
import type { CompanyRecord } from '@src/company/applications/contracts/company-record.interface';
import { CompanyRoleEnum } from '@src/company/domains/enums/company-role.enum';
import { CompanyStatusEnum } from '@src/company/domains/enums/company-status.enum';

describe('CompanyResponseMapper', () => {
  const mapper = new CompanyResponseMapper();
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
    social: {},
    role: CompanyRoleEnum.MAIN,
    logo: null,
    cover: null,
    status: CompanyStatusEnum.ACTIVE,
  };

  it('should normalize nullable media fields for a single response', () => {
    expect(mapper.toResponse(companyRecord)).toEqual({
      ...companyRecord,
      logo: undefined,
      cover: undefined,
    });
  });

  it('should normalize nullable media fields for lists', () => {
    expect(mapper.toListResponse([companyRecord])).toEqual([
      {
        ...companyRecord,
        logo: undefined,
        cover: undefined,
      },
    ]);
  });
});
