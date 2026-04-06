import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CompanyRoleEnum } from '@src/company/applications/contracts/company-role.enum';
import { CompanyStatusEnum } from '@src/company/applications/contracts/company-status.enum';
import { Type } from 'class-transformer';
import {
  UpdateCompanyAddressDto,
  UpdateCompanySocialDto,
} from './company-details.dto';

export class UpdateCompanyDto {
  @ApiProperty({ example: 'tecfit', minLength: 2, maxLength: 64 })
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(64)
  slug?: string;

  @ApiProperty({ example: 'Tecfit', minLength: 2, maxLength: 64 })
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(64)
  name?: string;

  @ApiProperty({
    type: UpdateCompanyAddressDto,
    required: false,
  })
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateCompanyAddressDto)
  address?: UpdateCompanyAddressDto;

  @ApiProperty({
    type: UpdateCompanySocialDto,
    required: false,
  })
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateCompanySocialDto)
  social?: UpdateCompanySocialDto;

  @ApiProperty({
    example: CompanyRoleEnum.AFFILIATE,
    enum: CompanyRoleEnum,
    required: false,
  })
  @IsOptional()
  @IsEnum(CompanyRoleEnum)
  role?: CompanyRoleEnum;

  @ApiProperty({ example: '/images/logo.png', minLength: 2, maxLength: 64 })
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(64)
  logo?: string;

  @ApiProperty({
    example: '/images/company-cover.png',
    minLength: 2,
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(255)
  cover?: string;

  @ApiProperty({
    example: CompanyStatusEnum.ACTIVE,
    enum: CompanyStatusEnum,
    required: false,
    default: CompanyStatusEnum.ACTIVE,
  })
  @IsOptional()
  @IsEnum(CompanyStatusEnum)
  status?: CompanyStatusEnum;
}
