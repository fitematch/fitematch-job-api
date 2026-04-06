import type { ListApplyRepositoryInterface } from '@src/apply/applications/contracts/list-apply.repository-interface';
import type { ApplyRecord } from '@src/apply/applications/contracts/apply-record.interface';
import { ApplyStatusEnum } from '@src/apply/applications/contracts/apply-status.enum';
import { ListApplyUseCase } from '@src/apply/applications/use-cases/list-apply.use-case';

describe('ListApplyUseCase', () => {
  let useCase: ListApplyUseCase;
  let repository: jest.Mocked<ListApplyRepositoryInterface>;

  const applies: ApplyRecord[] = [
    {
      id: 'apply-1',
      companyId: 'company-1',
      jobId: 'job-1',
      userId: 'user-1',
      status: ApplyStatusEnum.ACTIVE,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    },
    {
      id: 'apply-2',
      companyId: 'company-2',
      jobId: 'job-2',
      userId: 'user-2',
      status: ApplyStatusEnum.INACTIVE,
      createdAt: new Date('2026-01-02T00:00:00.000Z'),
      updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    },
  ];

  beforeEach(() => {
    repository = {
      list: jest.fn(),
    };

    useCase = new ListApplyUseCase(repository);
  });

  it('should list applies successfully', async () => {
    repository.list.mockResolvedValue(applies);

    const result = await useCase.execute();

    expect(repository.list.mock.calls).toHaveLength(1);
    expect(repository.list.mock.calls[0]).toEqual([]);
    expect(result).toEqual(applies);
  });

  it('should return an empty list when there are no applies', async () => {
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
