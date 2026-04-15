import {
  JobBenefitsValueObject,
  JobEntity,
  type Job,
} from '@src/job/domain/entities/job.entity';
import { JobRoleEnum } from '@src/job/domain/enums/job-role.enum';
import { JobStatusEnum } from '@src/job/domain/enums/job-status.enum';
import { DomainValidationError } from '@src/shared/domain/errors/domain-validation.error';

describe('JobEntity', () => {
  const jobInput: Job = {
    companyId: ' company-id ',
    slug: ' backend-intern ',
    title: ' Backend Intern ',
    slots: 3,
    cover: ' /images/job.png ',
    benefits: {
      salary: 2500,
      transportation: true,
      alimentation: true,
      health: true,
      parking: false,
      bonus: ' PLR trimestral ',
    },
    role: JobRoleEnum.INTERN,
    status: JobStatusEnum.ACTIVE,
  };

  describe('create', () => {
    it('should normalize fields and apply defaults', () => {
      const entity = JobEntity.create(jobInput);

      expect(entity.toPrimitives()).toEqual({
        companyId: 'company-id',
        isPaidAdvertising: false,
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
        id: undefined,
        createdAt: undefined,
        updatedAt: undefined,
      });
    });

    it('should throw when slots is invalid', () => {
      expect(() =>
        JobEntity.create({
          ...jobInput,
          slots: 0,
        }),
      ).toThrow(
        new DomainValidationError('slots must be greater than or equal to 1'),
      );
    });
  });

  describe('normalizeUpdate', () => {
    it('should normalize partial updates', () => {
      expect(
        JobEntity.normalizeUpdate({
          title: ' Updated ',
          companyId: ' company-2 ',
          benefits: {
            bonus: ' Bonus atualizado ',
            salary: 3000,
          },
        }),
      ).toEqual({
        title: 'Updated',
        companyId: 'company-2',
        benefits: {
          bonus: 'Bonus atualizado',
          salary: 3000,
        },
      });
    });
  });

  describe('value objects', () => {
    it('should normalize null salary and trim bonus', () => {
      expect(
        JobBenefitsValueObject.create({
          ...jobInput.benefits,
          salary: undefined,
        }).toPrimitives(),
      ).toEqual({
        ...jobInput.benefits,
        salary: null,
        bonus: 'PLR trimestral',
      });
    });

    it('should reject negative salary', () => {
      expect(() =>
        JobBenefitsValueObject.create({
          ...jobInput.benefits,
          salary: -1,
        }),
      ).toThrow(
        new DomainValidationError(
          'salary must be greater than or equal to zero',
        ),
      );
    });
  });
});
