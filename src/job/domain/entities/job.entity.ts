import type { JobStatusEnum } from '@src/job/domain/enums/job-status.enum';
import { DomainValidationError } from '@src/shared/domain/errors/domain-validation.error';
import { JobRoleEnum } from '../enums/job-role.enum';

export interface JobBenefits {
  salary?: number | null;
  transportation: boolean;
  alimentation: boolean;
  health: boolean;
  parking: boolean;
  bonus: string;
}

export interface Job {
  id?: string;
  companyId: string;
  isPaidAdvertising?: boolean;
  slug: string;
  title: string;
  slots: number;
  cover: string;
  benefits: JobBenefits;
  role: JobRoleEnum;
  status: JobStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
}

type JobEntityProps = Job;
type JobUpdate = Partial<
  Omit<JobEntityProps, 'benefits' | 'company'> & {
    benefits: Partial<JobBenefits>;
  }
>;

export class JobBenefitsValueObject {
  private constructor(private readonly value: JobBenefits) {}

  static create(benefits: JobBenefits): JobBenefitsValueObject {
    if (
      benefits.salary !== undefined &&
      benefits.salary !== null &&
      benefits.salary < 0
    ) {
      throw new DomainValidationError(
        'salary must be greater than or equal to zero',
      );
    }

    if (!benefits.bonus || !benefits.bonus.trim()) {
      throw new DomainValidationError('bonus is required');
    }

    return new JobBenefitsValueObject({
      salary: benefits.salary ?? null,
      transportation: benefits.transportation,
      alimentation: benefits.alimentation,
      health: benefits.health,
      parking: benefits.parking,
      bonus: benefits.bonus.trim(),
    });
  }

  toPrimitives(): JobBenefits {
    return { ...this.value };
  }
}

export class JobEntity {
  private constructor(private readonly props: JobEntityProps) {}

  static create(data: JobEntityProps): JobEntity {
    JobEntity.requireText(data.companyId, 'companyId');
    JobEntity.requireText(data.slug, 'slug');
    JobEntity.requireText(data.title, 'title');
    JobEntity.requireText(data.cover, 'cover');

    if (data.slots < 1) {
      throw new DomainValidationError(
        'slots must be greater than or equal to 1',
      );
    }

    const benefits = JobBenefitsValueObject.create(data.benefits);

    return new JobEntity({
      id: data.id,
      companyId: data.companyId.trim(),
      isPaidAdvertising: data.isPaidAdvertising ?? false,
      slug: data.slug.trim(),
      title: data.title.trim(),
      slots: data.slots,
      cover: data.cover.trim(),
      benefits: benefits.toPrimitives(),
      role: data.role,
      status: data.status,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  static fromRecord(data: JobEntityProps): JobEntity {
    return new JobEntity({
      id: data.id,
      companyId: data.companyId,
      isPaidAdvertising: data.isPaidAdvertising ?? false,
      slug: data.slug,
      title: data.title,
      slots: data.slots,
      cover: data.cover,
      benefits: {
        salary: data.benefits.salary ?? null,
        transportation: data.benefits.transportation,
        alimentation: data.benefits.alimentation,
        health: data.benefits.health,
        parking: data.benefits.parking,
        bonus: data.benefits.bonus,
      },
      role: data.role,
      status: data.status,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  static normalizeUpdate(data: JobUpdate): JobUpdate {
    const normalized: JobUpdate = {};

    if (data.companyId !== undefined) {
      normalized.companyId = data.companyId.trim();
    }

    if (data.slug !== undefined) {
      normalized.slug = data.slug.trim();
    }

    if (data.title !== undefined) {
      normalized.title = data.title.trim();
    }

    if (data.slots !== undefined) {
      if (data.slots < 1) {
        throw new DomainValidationError(
          'slots must be greater than or equal to 1',
        );
      }

      normalized.slots = data.slots;
    }

    if (data.cover !== undefined) {
      normalized.cover = data.cover.trim();
    }

    if (data.isPaidAdvertising !== undefined) {
      normalized.isPaidAdvertising = data.isPaidAdvertising;
    }

    if (data.benefits !== undefined) {
      normalized.benefits = {
        ...(data.benefits.salary !== undefined && {
          salary: JobBenefitsValueObject.create({
            salary: data.benefits.salary,
            transportation: true,
            alimentation: true,
            health: true,
            parking: true,
            bonus: data.benefits.bonus ?? 'normalized',
          }).toPrimitives().salary,
        }),
        ...(data.benefits.transportation !== undefined && {
          transportation: data.benefits.transportation,
        }),
        ...(data.benefits.alimentation !== undefined && {
          alimentation: data.benefits.alimentation,
        }),
        ...(data.benefits.health !== undefined && {
          health: data.benefits.health,
        }),
        ...(data.benefits.parking !== undefined && {
          parking: data.benefits.parking,
        }),
        ...(data.benefits.bonus !== undefined && {
          bonus: JobBenefitsValueObject.create({
            salary: 0,
            transportation: true,
            alimentation: true,
            health: true,
            parking: true,
            bonus: data.benefits.bonus,
          }).toPrimitives().bonus,
        }),
      };
    }

    if (data.role !== undefined) {
      normalized.role = data.role;
    }

    if (data.status !== undefined) {
      normalized.status = data.status;
    }

    return normalized;
  }

  toPrimitives(): Omit<JobEntityProps, 'company'> {
    return {
      id: this.props.id,
      companyId: this.props.companyId,
      isPaidAdvertising: this.props.isPaidAdvertising,
      slug: this.props.slug,
      title: this.props.title,
      slots: this.props.slots,
      cover: this.props.cover,
      benefits: { ...this.props.benefits },
      role: this.props.role,
      status: this.props.status,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }

  getBenefits(): JobBenefits {
    return { ...this.props.benefits };
  }

  getCompanyId(): string {
    return this.props.companyId;
  }

  private static requireText(value: string, fieldName: string): void {
    if (!value || !value.trim()) {
      throw new DomainValidationError(`${fieldName} is required`);
    }
  }
}
