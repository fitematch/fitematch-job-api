import { ApiProperty } from '@nestjs/swagger';
import { ApplyStatusEnum } from '@src/apply/applications/contracts/apply-status.enum';

export class ReadApplyResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  companyId!: string;

  @ApiProperty()
  jobId!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty({ enum: ApplyStatusEnum })
  status!: ApplyStatusEnum;

  @ApiProperty({ required: false })
  createdAt?: Date;

  @ApiProperty({ required: false })
  updatedAt?: Date;
}
