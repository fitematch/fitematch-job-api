import { CreateApplyUseCase } from '@src/apply/applications/use-cases/create-apply.use-case';
import type { CreateApplyRepositoryInterface } from '@src/apply/applications/contracts/create-apply.repository-interface';
import type { Apply } from '@src/apply/applications/contracts/apply.interface';
import type { ApplyRecord } from '@src/apply/applications/contracts/apply-record.interface';
import { ApplyStatusEnum } from '@src/apply/applications/contracts/apply-status.enum';

describe('CreateApplyUseCase', () => {
  let useCase: CreateApplyUseCase;
  let repository: jest.Mocked<CreateApplyRepositoryInterface>;

  const applyInput: Apply = {
    companyId: 'company-id',
    jobId: 'job-id',
    userId: 'user-id',
    status: ApplyStatusEnum.ACTIVE,
  };

  const applyRecord: ApplyRecord = {
    id: 'apply-id',
    companyId: 'company-id',
    jobId: 'job-id',
    userId: 'user-id',
    status: ApplyStatusEnum.ACTIVE,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  beforeEach(() => {
    repository = {
      create: jest.fn(),
    };

    useCase = new CreateApplyUseCase(repository);
  });

  it('should create an apply successfully', async () => {
    repository.create.mockResolvedValue(applyRecord);

    const result = await useCase.execute(applyInput);

    expect(repository.create.mock.calls).toHaveLength(1);
    expect(repository.create.mock.calls[0]).toEqual([applyInput]);
    expect(result).toEqual(applyRecord);
  });

  it('should preserve the provided status', async () => {
    const frozenApplyInput: Apply = {
      ...applyInput,
      status: ApplyStatusEnum.FREEZE,
    };

    repository.create.mockResolvedValue({
      ...applyRecord,
      status: ApplyStatusEnum.FREEZE,
    });

    await useCase.execute(frozenApplyInput);

    expect(repository.create.mock.calls[0]).toEqual([frozenApplyInput]);
  });

  it('should propagate repository exceptions', async () => {
    const error = new Error('database unavailable');
    repository.create.mockRejectedValue(error);

    await expect(useCase.execute(applyInput)).rejects.toThrow(error);
    expect(repository.create.mock.calls[0]).toEqual([applyInput]);
  });
});
