import { ApplyResponseMapper } from '@src/apply/adapters/controllers/responses/apply-response.mapper';
import type { ApplyRecord } from '@src/apply/applications/contracts/apply-record.interface';
import { ApplyStatusEnum } from '@src/apply/domain/enums/apply-status.enum';

describe('ApplyResponseMapper', () => {
  const mapper = new ApplyResponseMapper();
  const applyRecord: ApplyRecord = {
    id: 'apply-id',
    companyId: 'company-id',
    jobId: 'job-id',
    userId: 'user-id',
    status: ApplyStatusEnum.ACTIVE,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-02T00:00:00.000Z'),
  };

  it('should map a single record without mutation', () => {
    expect(mapper.toResponse(applyRecord)).toEqual(applyRecord);
  });

  it('should map record lists', () => {
    expect(mapper.toListResponse([applyRecord])).toEqual([applyRecord]);
  });
});
