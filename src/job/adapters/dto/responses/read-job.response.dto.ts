import { ApiProperty } from '@nestjs/swagger';
import { ReadCompanyResponseDto } from '@src/company/adapters/dto/responses/read-company.response.dto';
import { JobRoleEnum } from '@src/job/applications/contracts/job-role.enum';
import { JobStatusEnum } from '@src/job/applications/contracts/job-status.enum';
import { JobBenefitsResponseDto } from '../job-details.dto';

export class ReadJobResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  companyId!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  slots!: number;

  @ApiProperty({ type: JobBenefitsResponseDto })
  benefits!: JobBenefitsResponseDto;

  @ApiProperty({ default: false })
  isPaidAdvertising?: boolean;

  @ApiProperty({ enum: JobRoleEnum })
  role!: JobRoleEnum;

  @ApiProperty({ enum: JobStatusEnum })
  status!: JobStatusEnum;

  @ApiProperty({ type: ReadCompanyResponseDto })
  company!: ReadCompanyResponseDto;

  @ApiProperty({ required: false })
  createdAt?: Date;

  @ApiProperty({ required: false })
  updatedAt?: Date;
}
