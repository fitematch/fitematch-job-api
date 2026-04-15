import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CompanyRoleEnum } from '@src/company/domains/enums/company-role.enum';
import { CompanyStatusEnum } from '@src/company/domains/enums/company-status.enum';
import {
  CreateCompanyAddressDto,
  CreateCompanySocialDto,
} from './company-details.dto';
import { Type } from 'class-transformer';

export class CreateCompanyDto {
  @ApiProperty({ example: 'company-x', minLength: 2, maxLength: 64 })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(64)
  slug!: string;

  @ApiProperty({ example: 'CompanyX', minLength: 2, maxLength: 64 })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(64)
  name!: string;

  @ApiProperty({ type: CreateCompanyAddressDto })
  @IsObject()
  @ValidateNested()
  @Type(() => CreateCompanyAddressDto)
  address!: CreateCompanyAddressDto;

  @ApiProperty({
    type: CreateCompanySocialDto,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => CreateCompanySocialDto)
  social!: CreateCompanySocialDto;

  @ApiProperty({
    example: CompanyRoleEnum.AFFILIATE,
    enum: CompanyRoleEnum,
    required: false,
  })
  @IsOptional()
  @IsEnum(CompanyRoleEnum)
  role?: CompanyRoleEnum;

  @ApiProperty({
    example: '/images/logo.png',
    minLength: 2,
    maxLength: 64,
    required: false,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(64)
  logo?: string | null;

  @ApiProperty({
    example: '/images/company-cover.png',
    minLength: 2,
    maxLength: 255,
    required: false,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(255)
  cover?: string | null;

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
