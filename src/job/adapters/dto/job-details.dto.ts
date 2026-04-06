import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class JobBenefitsDto {
  @ApiPropertyOptional({ example: 2500, minimum: 0, nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salary?: number | null;

  @ApiProperty({ example: true })
  @IsBoolean()
  transportation!: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  alimentation!: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  health!: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  parking!: boolean;

  @ApiProperty({ example: 'PLR e bonus trimestral', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  bonus!: string;
}

export class CreateJobBenefitsDto extends JobBenefitsDto {}

export class UpdateJobBenefitsDto {
  @ApiPropertyOptional({ example: 2500, minimum: 0, nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salary?: number | null;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  transportation?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  alimentation?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  health?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  parking?: boolean;

  @ApiPropertyOptional({ example: 'PLR e bonus trimestral', maxLength: 255 })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  bonus?: string;
}

export class JobBenefitsResponseDto {
  @ApiPropertyOptional({ example: 'R$ 2.500,00', nullable: true })
  salary?: string | null;

  @ApiProperty({ example: true })
  transportation!: boolean;

  @ApiProperty({ example: true })
  alimentation!: boolean;

  @ApiProperty({ example: true })
  health!: boolean;

  @ApiProperty({ example: false })
  parking!: boolean;

  @ApiProperty({ example: 'PLR e bonus trimestral', maxLength: 255 })
  bonus!: string;
}
