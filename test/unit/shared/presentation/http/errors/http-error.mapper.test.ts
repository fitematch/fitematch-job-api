import { BadRequestException } from '@nestjs/common';
import { ConflictApplicationError } from '@src/shared/application/errors/conflict.application-error';
import { DomainValidationError } from '@src/shared/domain/errors/domain-validation.error';
import { HttpErrorMapper } from '@src/shared/presentation/http/errors/http-error.mapper';

describe('HttpErrorMapper', () => {
  const mapper = new HttpErrorMapper();

  it('should map domain errors to 400 responses', () => {
    expect(
      mapper.toHttpError(new DomainValidationError('invalid data')),
    ).toEqual({
      statusCode: 400,
      message: 'invalid data',
      error: 'DomainValidationError',
      code: 'DOMAIN_VALIDATION_ERROR',
    });
  });

  it('should map application errors using their status code and code', () => {
    expect(
      mapper.toHttpError(new ConflictApplicationError('slug already exists')),
    ).toEqual({
      statusCode: 409,
      message: 'slug already exists',
      error: 'ConflictApplicationError',
      code: 'RESOURCE_CONFLICT',
    });
  });

  it('should preserve http exceptions', () => {
    expect(
      mapper.toHttpError(
        new BadRequestException({
          message: 'invalid payload',
          error: 'Bad Request',
          code: 'BAD_REQUEST',
        }),
      ),
    ).toEqual({
      statusCode: 400,
      message: 'invalid payload',
      error: 'Bad Request',
      code: 'BAD_REQUEST',
    });
  });

  it('should fallback to 500 for unknown errors', () => {
    expect(mapper.toHttpError(new Error('boom'))).toEqual({
      statusCode: 500,
      message: 'An unexpected error occurred!',
      error: 'InternalServerError',
      code: 'INTERNAL_SERVER_ERROR',
    });
  });
});
