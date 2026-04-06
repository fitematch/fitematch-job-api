import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CompanyAddressDto {
  @ApiProperty({ example: 'Rua das Flores', minLength: 2, maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(255)
  street!: string;

  @ApiProperty({ example: '123A', minLength: 1, maxLength: 32 })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(32)
  number!: string;

  @ApiProperty({ example: 'Centro', minLength: 2, maxLength: 128 })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(128)
  neighborhood!: string;

  @ApiProperty({ example: 'Sao Paulo', minLength: 2, maxLength: 128 })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(128)
  city!: string;

  @ApiProperty({ example: 'SP', minLength: 2, maxLength: 64 })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(64)
  state!: string;

  @ApiProperty({ example: 'Brasil', minLength: 2, maxLength: 64 })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(64)
  country!: string;
}

export class CompanySocialDto {
  @ApiPropertyOptional({
    example: 'https://facebook.com/empresaX',
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(255)
  facebook?: string;

  @ApiPropertyOptional({
    example: 'https://instagram.com/empresaX',
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(255)
  instagram?: string;

  @ApiPropertyOptional({
    example: 'https://linkedin.com/company/empresaX',
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(255)
  linkedin?: string;

  @ApiPropertyOptional({ example: 'https://x.com/empresaX', maxLength: 255 })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(255)
  twitter?: string;
}

export class CreateCompanyAddressDto extends CompanyAddressDto {}

export class UpdateCompanyAddressDto extends CompanyAddressDto {}

export class CreateCompanySocialDto extends CompanySocialDto {}

export class UpdateCompanySocialDto extends CompanySocialDto {}
