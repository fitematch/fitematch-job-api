import { Body, Controller, Inject, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateApplyDto } from '@src/apply/adapters/dto/create-apply.dto';
import { CreateApplyResponseDto } from '@src/apply/adapters/dto/responses/create-apply.response.dto';
import type { ApplyRecord } from '@src/apply/applications/contracts/apply-record.interface';
import {
  CREATE_APPLY_USE_CASE,
  type CreateApplyUseCaseInterface,
} from '@src/apply/applications/contracts/create-apply.use-case-interface';
import { ApplyStatusEnum } from '@src/apply/applications/contracts/apply-status.enum';

@ApiTags('Apply')
@Controller('apply')
export class CreateApplyController {
  constructor(
    @Inject(CREATE_APPLY_USE_CASE)
    private readonly createApplyUseCase: CreateApplyUseCaseInterface,
  ) {}

  @ApiOperation({
    summary: 'Create job application.',
    description: 'Creates a new job application.',
  })
  @ApiBody({ type: CreateApplyDto })
  @ApiCreatedResponse({
    description: 'Job application created successfully.',
    type: CreateApplyResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation error in the submitted data.',
  })
  @Post()
  async create(@Body() data: CreateApplyDto): Promise<ApplyRecord> {
    return this.createApplyUseCase.execute({
      ...data,
      status: data.status ?? ApplyStatusEnum.ACTIVE,
    });
  }
}
