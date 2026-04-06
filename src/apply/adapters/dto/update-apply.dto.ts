import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApplyStatusEnum } from '@src/apply/applications/contracts/apply-status.enum';

export class UpdateApplyDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  companyId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  jobId?: string;

  @ApiProperty({
    example: ApplyStatusEnum.ACTIVE,
    enum: ApplyStatusEnum,
    required: false,
  })
  @IsOptional()
  @IsEnum(ApplyStatusEnum)
  status?: ApplyStatusEnum;
}
