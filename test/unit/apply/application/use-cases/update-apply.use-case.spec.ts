import { NotFoundException } from '@nestjs/common';
import type { Apply } from '@src/apply/applications/contracts/apply.interface';
import type { ApplyRecord } from '@src/apply/applications/contracts/apply-record.interface';
import { ApplyStatusEnum } from '@src/apply/applications/contracts/apply-status.enum';
import type { UpdateApplyRepositoryInterface } from '@src/apply/applications/contracts/update-apply.repository-interface';
import { UpdateApplyUseCase } from '@src/apply/applications/use-cases/update-apply.use-case';

describe('UpdateApplyUseCase', () => {
  let useCase: UpdateApplyUseCase;
  let repository: jest.Mocked<UpdateApplyRepositoryInterface>;

  const applyId = 'apply-id';
  const updateInput: Partial<Apply> = {
    status: ApplyStatusEnum.FREEZE,
  };

  const updatedApply: ApplyRecord = {
    id: applyId,
    companyId: 'company-id',
    jobId: 'job-id',
    status: ApplyStatusEnum.FREEZE,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-02T00:00:00.000Z'),
  };

  beforeEach(() => {
    repository = {
      update: jest.fn(),
    };

    useCase = new UpdateApplyUseCase(repository);
  });

  it('should update an apply successfully', async () => {
    repository.update.mockResolvedValue(updatedApply);

    const result = await useCase.execute(applyId, updateInput);

    expect(repository.update.mock.calls).toHaveLength(1);
    expect(repository.update.mock.calls[0]).toEqual([applyId, updateInput]);
    expect(result).toEqual(updatedApply);
  });

  it('should throw NotFoundException when the apply does not exist', async () => {
    repository.update.mockResolvedValue(null);

    await expect(useCase.execute(applyId, updateInput)).rejects.toThrow(
      NotFoundException,
    );
    await expect(useCase.execute(applyId, updateInput)).rejects.toThrow(
      'Apply not found!',
    );
    expect(repository.update.mock.calls[0]).toEqual([applyId, updateInput]);
  });

  it('should propagate repository exceptions', async () => {
    const error = new Error('database unavailable');
    repository.update.mockRejectedValue(error);

    await expect(useCase.execute(applyId, updateInput)).rejects.toThrow(error);
    expect(repository.update.mock.calls[0]).toEqual([applyId, updateInput]);
  });
});
