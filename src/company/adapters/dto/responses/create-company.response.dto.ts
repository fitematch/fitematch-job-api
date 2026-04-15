import { ApiProperty } from '@nestjs/swagger';
import { CompanyRoleEnum } from '@src/company/domains/enums/company-role.enum';
import { CompanyStatusEnum } from '@src/company/domains/enums/company-status.enum';
import {
  CompanyAddressDto as CompanyAddressResponseDto,
  CompanySocialDto as CompanySocialResponseDto,
} from '@src/company/adapters/dto/company-details.dto';

export class CreateCompanyResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ type: CompanyAddressResponseDto })
  address!: CompanyAddressResponseDto;

  @ApiProperty({ type: CompanySocialResponseDto })
  social!: CompanySocialResponseDto;

  @ApiProperty({ enum: CompanyRoleEnum })
  role!: CompanyRoleEnum;

  @ApiProperty()
  logo?: string;

  @ApiProperty()
  cover?: string;

  @ApiProperty({ enum: CompanyStatusEnum })
  status!: CompanyStatusEnum;

  @ApiProperty({ required: false })
  createdAt?: Date;

  @ApiProperty({ required: false })
  updatedAt?: Date;
}
