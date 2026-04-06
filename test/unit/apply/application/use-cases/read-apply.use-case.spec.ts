import { NotFoundException } from '@nestjs/common';
import type { ReadApplyRepositoryInterface } from '@src/apply/applications/contracts/read-apply.repository-interface';
import type { ApplyRecord } from '@src/apply/applications/contracts/apply-record.interface';
import { ApplyStatusEnum } from '@src/apply/applications/contracts/apply-status.enum';
import { ReadApplyUseCase } from '@src/apply/applications/use-cases/read-apply.use-case';

describe('ReadApplyUseCase', () => {
  let useCase: ReadApplyUseCase;
  let repository: jest.Mocked<ReadApplyRepositoryInterface>;

  const applyId = 'apply-id';
  const applyRecord: ApplyRecord = {
    id: applyId,
    companyId: 'company-id',
    jobId: 'job-id',
    status: ApplyStatusEnum.ACTIVE,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
    };

    useCase = new ReadApplyUseCase(repository);
  });

  it('should return an apply when it exists', async () => {
    repository.findById.mockResolvedValue(applyRecord);

    const result = await useCase.execute(applyId);

    expect(repository.findById.mock.calls).toHaveLength(1);
    expect(repository.findById.mock.calls[0]).toEqual([applyId]);
    expect(result).toEqual(applyRecord);
  });

  it('should throw NotFoundException when the apply does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(useCase.execute(applyId)).rejects.toThrow(NotFoundException);
    await expect(useCase.execute(applyId)).rejects.toThrow('Apply not found!');
    expect(repository.findById.mock.calls[0]).toEqual([applyId]);
  });

  it('should propagate repository exceptions', async () => {
    const error = new Error('database unavailable');
    repository.findById.mockRejectedValue(error);

    await expect(useCase.execute(applyId)).rejects.toThrow(error);
    expect(repository.findById.mock.calls[0]).toEqual([applyId]);
  });
});
