import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { CreateApplyRepositoryInterface } from '@src/apply/applications/contracts/create-apply.repository-interface';
import type { DeleteApplyRepositoryInterface } from '@src/apply/applications/contracts/delete-apply.repository-interface';
import type { Apply } from '@src/apply/applications/contracts/apply.interface';
import type { ApplyRecord } from '@src/apply/applications/contracts/apply-record.interface';
import type { ListApplyRepositoryInterface } from '@src/apply/applications/contracts/list-apply.repository-interface';
import type { ReadApplyRepositoryInterface } from '@src/apply/applications/contracts/read-apply.repository-interface';
import type { UpdateApplyRepositoryInterface } from '@src/apply/applications/contracts/update-apply.repository-interface';
import {
  ApplyEntity,
  type ApplyDocument,
} from '@src/apply/domains/schemas/apply.schema';
import { Model } from 'mongoose';

@Injectable()
export class ApplyRepository
  implements
    ListApplyRepositoryInterface,
    CreateApplyRepositoryInterface,
    ReadApplyRepositoryInterface,
    UpdateApplyRepositoryInterface,
    DeleteApplyRepositoryInterface
{
  constructor(
    @InjectModel(ApplyEntity.name)
    private readonly applyModel: Model<ApplyDocument>,
  ) {}

  async create(data: Apply): Promise<ApplyRecord> {
    const apply = await this.applyModel.create(data);

    return this.toRecord(apply);
  }

  async list(): Promise<ApplyRecord[]> {
    const applies = await this.applyModel.find().exec();

    return applies.map((apply) => this.toRecord(apply));
  }

  async findById(id: string): Promise<ApplyRecord | null> {
    const apply = await this.applyModel.findById(id).exec();

    return apply ? this.toRecord(apply) : null;
  }

  async update(id: string, data: Partial<Apply>): Promise<ApplyRecord | null> {
    const apply = await this.applyModel
      .findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .exec();

    return apply ? this.toRecord(apply) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.applyModel.findByIdAndDelete(id).exec();

    return Boolean(result);
  }

  private toRecord(document: ApplyDocument): ApplyRecord {
    return {
      id: document._id.toString(),
      companyId: document.companyId,
      jobId: document.jobId,
      userId: document.userId,
      status: document.status,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }
}
