import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Company } from '@src/company/applications/contracts/company.interface';
import type { CompanyRecord } from '@src/company/applications/contracts/company-record.interface';
import type { ListCompanyRepositoryInterface } from '@src/company/applications/contracts/list-company.repository-interface';
import type { CreateCompanyRepositoryInterface } from '@src/company/applications/contracts/create-company.repository-interface';
import type { ReadCompanyRepositoryInterface } from '@src/company/applications/contracts/read-company.repository-interface';
import type { UpdateCompanyRepositoryInterface } from '@src/company/applications/contracts/update-company.repository-interface';
import type { DeleteCompanyRepositoryInterface } from '@src/company/applications/contracts/delete-company.repository-interface';
import {
  CompanyEntity,
  type CompanyDocument,
} from '@src/company/domains/schemas/company.schema';
import { Model } from 'mongoose';

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
    if (
      typeof error !== 'object' ||
      error === null ||
      !('code' in error) ||
      error.code !== 11000
    ) {
      return;
    }

    const duplicatedFields =
      'keyPattern' in error &&
      typeof error.keyPattern === 'object' &&
      error.keyPattern !== null
        ? Object.keys(error.keyPattern)
        : [];

    if (duplicatedFields.includes('slug')) {
      throw new ConflictException('slug already exists');
    }

    throw new ConflictException('duplicate unique field');
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
