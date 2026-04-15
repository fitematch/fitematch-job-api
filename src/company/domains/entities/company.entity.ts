import type { CompanyRoleEnum } from '@src/company/domains/enums/company-role.enum';
import type { CompanyStatusEnum } from '@src/company/domains/enums/company-status.enum';
import { CompanyRoleEnum as CompanyRoleDefault } from '@src/company/domains/enums/company-role.enum';
import { CompanyStatusEnum as CompanyStatusDefault } from '@src/company/domains/enums/company-status.enum';
import { DomainValidationError } from '@src/shared/domain/errors/domain-validation.error';

export type CompanyAddress = {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
};

export type CompanySocial = {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
};

export interface Company {
  slug: string;
  name: string;
  address: CompanyAddress;
  social: CompanySocial;
  logo?: string | null;
  role?: CompanyRoleEnum;
  cover?: string | null;
  status?: CompanyStatusEnum;
}

export class CompanyAddressValueObject {
  private constructor(private readonly value: CompanyAddress) {}

  static create(address: CompanyAddress): CompanyAddressValueObject {
    const normalizedAddress = {
      street: CompanyAddressValueObject.requireText(address.street, 'street'),
      number: CompanyAddressValueObject.requireText(address.number, 'number'),
      neighborhood: CompanyAddressValueObject.requireText(
        address.neighborhood,
        'neighborhood',
      ),
      city: CompanyAddressValueObject.requireText(address.city, 'city'),
      state: CompanyAddressValueObject.requireText(address.state, 'state'),
      country: CompanyAddressValueObject.requireText(
        address.country,
        'country',
      ),
    };

    return new CompanyAddressValueObject(normalizedAddress);
  }

  toPrimitives(): CompanyAddress {
    return { ...this.value };
  }

  private static requireText(value: string, fieldName: string): string {
    if (!value || !value.trim()) {
      throw new DomainValidationError(`${fieldName} is required`);
    }

    return value.trim();
  }
}

export class CompanySocialValueObject {
  private constructor(private readonly value: CompanySocial) {}

  static create(social?: CompanySocial | null): CompanySocialValueObject {
    return new CompanySocialValueObject({
      facebook: social?.facebook?.trim() || undefined,
      instagram: social?.instagram?.trim() || undefined,
      linkedin: social?.linkedin?.trim() || undefined,
      twitter: social?.twitter?.trim() || undefined,
    });
  }

  toPrimitives(): CompanySocial {
    return { ...this.value };
  }
}

export class CompanyEntity {
  private constructor(private readonly props: Required<Company>) {}

  static create(data: Company): CompanyEntity {
    if (!data.slug || !data.slug.trim()) {
      throw new DomainValidationError('slug is required');
    }

    if (!data.name || !data.name.trim()) {
      throw new DomainValidationError('name is required');
    }

    const address = CompanyAddressValueObject.create(data.address);
    const social = CompanySocialValueObject.create(data.social);

    return new CompanyEntity({
      slug: data.slug.trim(),
      name: data.name.trim(),
      address: address.toPrimitives(),
      social: social.toPrimitives(),
      logo: data.logo?.trim() || null,
      role: data.role ?? CompanyRoleDefault.MAIN,
      cover: data.cover?.trim() || null,
      status: data.status ?? CompanyStatusDefault.ACTIVE,
    });
  }

  static fromRecord(
    data: Company & { role: CompanyRoleEnum; status: CompanyStatusEnum },
  ): CompanyEntity {
    return CompanyEntity.create(data);
  }

  static normalizeUpdate(data: Partial<Company>): Partial<Company> {
    const normalized: Partial<Company> = {};

    if (data.slug !== undefined) {
      normalized.slug = data.slug.trim();
    }

    if (data.name !== undefined) {
      normalized.name = data.name.trim();
    }

    if (data.address !== undefined) {
      normalized.address = CompanyAddressValueObject.create(
        data.address,
      ).toPrimitives();
    }

    if (data.social !== undefined) {
      normalized.social = CompanySocialValueObject.create(
        data.social,
      ).toPrimitives();
    }

    if (data.logo !== undefined) {
      normalized.logo = data.logo?.trim() || null;
    }

    if (data.cover !== undefined) {
      normalized.cover = data.cover?.trim() || null;
    }

    if (data.role !== undefined) {
      normalized.role = data.role;
    }

    if (data.status !== undefined) {
      normalized.status = data.status;
    }

    return normalized;
  }

  toPrimitives(): Required<Company> {
    return {
      slug: this.props.slug,
      name: this.props.name,
      address: { ...this.props.address },
      social: { ...this.props.social },
      logo: this.props.logo,
      role: this.props.role,
      cover: this.props.cover,
      status: this.props.status,
    };
  }

  getSocial(): CompanySocial {
    return { ...this.props.social };
  }

  getLogo(): string {
    return this.props.logo ?? '';
  }

  getCover(): string {
    return this.props.cover ?? '';
  }
}
