import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApplyStatusEnum } from '@src/apply/applications/contracts/apply-status.enum';

export class CreateApplyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  companyId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  jobId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @ApiProperty({
    example: ApplyStatusEnum.ACTIVE,
    enum: ApplyStatusEnum,
    required: false,
    default: ApplyStatusEnum.ACTIVE,
  })
  @IsEnum(ApplyStatusEnum)
  @IsOptional()
  status?: ApplyStatusEnum;
}
