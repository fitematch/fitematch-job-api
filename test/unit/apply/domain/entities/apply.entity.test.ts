import {
  ApplyEntity,
  type Apply,
} from '@src/apply/domain/entities/apply.entity';
import { ApplyStatusEnum } from '@src/apply/domain/enums/apply-status.enum';
import { DomainValidationError } from '@src/shared/domain/errors/domain-validation.error';

describe('ApplyEntity', () => {
  const applyInput: Apply = {
    companyId: ' company-id ',
    jobId: ' job-id ',
    userId: ' user-id ',
  };

  describe('create', () => {
    it('should trim identifiers and apply the default status', () => {
      const entity = ApplyEntity.create(applyInput);

      expect(entity.toPrimitives()).toEqual({
        companyId: 'company-id',
        jobId: 'job-id',
        userId: 'user-id',
        status: ApplyStatusEnum.ACTIVE,
      });
    });

    it('should preserve the provided status', () => {
      const entity = ApplyEntity.create({
        ...applyInput,
        status: ApplyStatusEnum.FREEZE,
      });

      expect(entity.toPrimitives().status).toBe(ApplyStatusEnum.FREEZE);
    });

    it('should throw when an identifier is empty', () => {
      expect(() =>
        ApplyEntity.create({
          ...applyInput,
          companyId: '   ',
        }),
      ).toThrow(new DomainValidationError('companyId is required'));
    });
  });

  describe('normalizeUpdate', () => {
    it('should keep only supported fields', () => {
      expect(
        ApplyEntity.normalizeUpdate({
          status: ApplyStatusEnum.INACTIVE,
          companyId: 'ignored',
        }),
      ).toEqual({
        status: ApplyStatusEnum.INACTIVE,
      });
    });
  });
});
