import { NotFoundException } from '@nestjs/common';
import { DeleteCompanyUseCase } from '@src/company/applications/use-cases/delete-company.use-case';
import type { DeleteCompanyRepositoryInterface } from '@src/company/applications/contracts/delete-company.repository-interface';

describe('DeleteCompanyUseCase', () => {
  let useCase: DeleteCompanyUseCase;
  let repository: jest.Mocked<DeleteCompanyRepositoryInterface>;

  const companyId = 'company-id';

  beforeEach(() => {
    repository = {
      delete: jest.fn(),
    };

    useCase = new DeleteCompanyUseCase(repository);
  });

  it('should delete a company successfully', async () => {
    repository.delete.mockResolvedValue(true);

    const result = await useCase.execute(companyId);

    expect(repository.delete.mock.calls).toHaveLength(1);
    expect(repository.delete.mock.calls[0]).toEqual([companyId]);
    expect(result).toBe(true);
  });

  it('should throw NotFoundException when the company does not exist', async () => {
    repository.delete.mockResolvedValue(false);

    await expect(useCase.execute(companyId)).rejects.toThrow(NotFoundException);
    await expect(useCase.execute(companyId)).rejects.toThrow(
      'Company not found!',
    );
    expect(repository.delete.mock.calls[0]).toEqual([companyId]);
  });

  it('should propagate repository exceptions', async () => {
    const error = new Error('database unavailable');
    repository.delete.mockRejectedValue(error);

    await expect(useCase.execute(companyId)).rejects.toThrow(error);
    expect(repository.delete.mock.calls[0]).toEqual([companyId]);
  });
});
