import { NotFoundException } from '@nestjs/common';
import type { DeleteApplyRepositoryInterface } from '@src/apply/applications/contracts/delete-apply.repository-interface';
import { DeleteApplyUseCase } from '@src/apply/applications/use-cases/delete-apply.use-case';

describe('DeleteApplyUseCase', () => {
  let useCase: DeleteApplyUseCase;
  let repository: jest.Mocked<DeleteApplyRepositoryInterface>;

  const applyId = 'apply-id';

  beforeEach(() => {
    repository = {
      delete: jest.fn(),
    };

    useCase = new DeleteApplyUseCase(repository);
  });

  it('should delete an apply successfully', async () => {
    repository.delete.mockResolvedValue(true);

    const result = await useCase.execute(applyId);

    expect(repository.delete.mock.calls).toHaveLength(1);
    expect(repository.delete.mock.calls[0]).toEqual([applyId]);
    expect(result).toBe(true);
  });

  it('should throw NotFoundException when the apply does not exist', async () => {
    repository.delete.mockResolvedValue(false);

    await expect(useCase.execute(applyId)).rejects.toThrow(NotFoundException);
    await expect(useCase.execute(applyId)).rejects.toThrow('Apply not found!');
    expect(repository.delete.mock.calls[0]).toEqual([applyId]);
  });

  it('should propagate repository exceptions', async () => {
    const error = new Error('database unavailable');
    repository.delete.mockRejectedValue(error);

    await expect(useCase.execute(applyId)).rejects.toThrow(error);
    expect(repository.delete.mock.calls[0]).toEqual([applyId]);
  });
});
