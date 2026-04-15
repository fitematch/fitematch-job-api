import {
  CompanyAddressValueObject,
  CompanyEntity,
  CompanySocialValueObject,
  type Company,
} from '@src/company/domains/entities/company.entity';
import { CompanyRoleEnum } from '@src/company/domains/enums/company-role.enum';
import { CompanyStatusEnum } from '@src/company/domains/enums/company-status.enum';
import { DomainValidationError } from '@src/shared/domain/errors/domain-validation.error';

describe('CompanyEntity', () => {
  const companyInput: Company = {
    slug: ' tecfit ',
    name: ' Tecfit ',
    address: {
      street: ' Rua das Flores ',
      number: ' 123 ',
      neighborhood: ' Centro ',
      city: ' Sao Paulo ',
      state: ' SP ',
      country: ' Brasil ',
    },
    social: {
      instagram: ' https://instagram.com/tecfit ',
    },
    logo: ' /images/logo.png ',
    cover: ' /images/cover.png ',
  };

  describe('create', () => {
    it('should normalize fields and apply defaults', () => {
      const entity = CompanyEntity.create(companyInput);

      expect(entity.toPrimitives()).toEqual({
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
          instagram: 'https://instagram.com/tecfit',
        },
        logo: '/images/logo.png',
        cover: '/images/cover.png',
        role: CompanyRoleEnum.MAIN,
        status: CompanyStatusEnum.ACTIVE,
      });
    });

    it('should throw when slug is empty', () => {
      expect(() =>
        CompanyEntity.create({
          ...companyInput,
          slug: '   ',
        }),
      ).toThrow(new DomainValidationError('slug is required'));
    });
  });

  describe('normalizeUpdate', () => {
    it('should normalize partial updates', () => {
      expect(
        CompanyEntity.normalizeUpdate({
          slug: ' updated ',
          logo: ' /new-logo.png ',
          cover: '   ',
          social: {
            linkedin: ' https://linkedin.com/company/tecfit ',
          },
        }),
      ).toEqual({
        slug: 'updated',
        logo: '/new-logo.png',
        cover: null,
        social: {
          linkedin: 'https://linkedin.com/company/tecfit',
        },
      });
    });
  });

  describe('value objects', () => {
    it('should trim social links', () => {
      expect(
        CompanySocialValueObject.create({
          facebook: ' https://facebook.com/tecfit ',
        }).toPrimitives(),
      ).toEqual({
        facebook: 'https://facebook.com/tecfit',
      });
    });

    it('should validate required address fields', () => {
      expect(() =>
        CompanyAddressValueObject.create({
          ...companyInput.address,
          city: '   ',
        }),
      ).toThrow(new DomainValidationError('city is required'));
    });
  });
});
