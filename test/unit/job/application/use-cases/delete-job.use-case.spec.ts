import { NotFoundException } from '@nestjs/common';
import type { DeleteJobRepositoryInterface } from '@src/job/applications/contracts/delete-job.repository-interface';
import { DeleteJobUseCase } from '@src/job/applications/use-cases/delete-job.use-case';

describe('DeleteJobUseCase', () => {
  let useCase: DeleteJobUseCase;
  let repository: jest.Mocked<DeleteJobRepositoryInterface>;

  const jobId = 'job-id';

  beforeEach(() => {
    repository = {
      delete: jest.fn(),
    };

    useCase = new DeleteJobUseCase(repository);
  });

  it('should delete a job successfully', async () => {
    repository.delete.mockResolvedValue(true);

    const result = await useCase.execute(jobId);

    expect(repository.delete.mock.calls).toHaveLength(1);
    expect(repository.delete.mock.calls[0]).toEqual([jobId]);
    expect(result).toBe(true);
  });

  it('should throw NotFoundException when the job does not exist', async () => {
    repository.delete.mockResolvedValue(false);

    await expect(useCase.execute(jobId)).rejects.toThrow(NotFoundException);
    await expect(useCase.execute(jobId)).rejects.toThrow('Job not found!');
    expect(repository.delete.mock.calls[0]).toEqual([jobId]);
  });

  it('should propagate repository exceptions', async () => {
    const error = new Error('database unavailable');
    repository.delete.mockRejectedValue(error);

    await expect(useCase.execute(jobId)).rejects.toThrow(error);
    expect(repository.delete.mock.calls[0]).toEqual([jobId]);
  });
});
