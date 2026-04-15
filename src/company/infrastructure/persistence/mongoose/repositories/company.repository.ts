import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { CreateCompanyRepositoryInterface } from '@src/company/applications/contracts/create-company.repository-interface';
import type { DeleteCompanyRepositoryInterface } from '@src/company/applications/contracts/delete-company.repository-interface';
import type { ListCompanyRepositoryInterface } from '@src/company/applications/contracts/list-company.repository-interface';
import type { ReadCompanyRepositoryInterface } from '@src/company/applications/contracts/read-company.repository-interface';
import type { UpdateCompanyRepositoryInterface } from '@src/company/applications/contracts/update-company.repository-interface';
import type { CompanyRecord } from '@src/company/applications/contracts/company-record.interface';
import type { Company } from '@src/company/domains/entities/company.entity';
import {
  CompanyEntity,
  type CompanyDocument,
} from '@src/company/infrastructure/persistence/mongoose/schemas/company.schema';
import { ConflictApplicationError } from '@src/shared/application/errors/conflict.application-error';
import { Model } from 'mongoose';

type DuplicateKeyError = {
  code?: number;
  keyPattern?: Record<string, unknown>;
};

@Injectable()
export class CompanyRepository
  implements
    ListCompanyRepositoryInterface,
    CreateCompanyRepositoryInterface,
    ReadCompanyRepositoryInterface,
    UpdateCompanyRepositoryInterface,
    DeleteCompanyRepositoryInterface
{
  constructor(
    @InjectModel(CompanyEntity.name)
    private readonly companyModel: Model<CompanyDocument>,
  ) {}

  async create(data: Company): Promise<CompanyRecord> {
    try {
      const company = await this.companyModel.create(data);

      return this.toRecord(company);
    } catch (error) {
      this.handleDuplicateKeyError(error);
      throw error;
    }
  }

  async list(): Promise<CompanyRecord[]> {
    const companies = await this.companyModel.find().exec();

    return companies.map((company) => this.toRecord(company));
  }

  async findById(id: string): Promise<CompanyRecord | null> {
    const company = await this.companyModel.findById(id).exec();

    return company ? this.toRecord(company) : null;
  }

  async update(
    id: string,
    data: Partial<Company>,
  ): Promise<CompanyRecord | null> {
    try {
      const company = await this.companyModel
        .findByIdAndUpdate(id, data, { new: true, runValidators: true })
        .exec();

      return company ? this.toRecord(company) : null;
    } catch (error) {
      this.handleDuplicateKeyError(error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.companyModel.findByIdAndDelete(id).exec();

    return Boolean(result);
  }

  private handleDuplicateKeyError(error: unknown): void {
    const duplicateKeyError = error as DuplicateKeyError;

    if (duplicateKeyError?.code !== 11000) {
      return;
    }

    const duplicatedFields = duplicateKeyError.keyPattern
      ? Object.keys(duplicateKeyError.keyPattern)
      : [];

    if (duplicatedFields.includes('slug')) {
      throw new ConflictApplicationError('slug already exists');
    }

    throw new ConflictApplicationError('duplicate unique field');
  }

  private toRecord(document: CompanyDocument): CompanyRecord {
    return {
      id: document._id.toString(),
      slug: document.slug,
      name: document.name,
      address: document.address,
      social: document.social ?? {},
      role: document.role,
      logo: document.logo,
      cover: document.cover,
      status: document.status,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }
}
