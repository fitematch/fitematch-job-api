import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { CreateJobRepositoryInterface } from '@src/job/applications/contracts/create-job.repository-interface';
import type { DeleteJobRepositoryInterface } from '@src/job/applications/contracts/delete-job.repository-interface';
import type {
  JobPayload,
  UpdateJobPayload,
} from '@src/job/applications/contracts/job-payload.interface';
import type { JobRecord } from '@src/job/applications/contracts/job-record.interface';
import type { ListJobRepositoryInterface } from '@src/job/applications/contracts/list-job.repository-interface';
import type { ReadJobRepositoryInterface } from '@src/job/applications/contracts/read-job.repository-interface';
import type { UpdateJobRepositoryInterface } from '@src/job/applications/contracts/update-job.repository-interface';
import {
  JobEntity,
  type JobDocument,
} from '@src/job/domains/schemas/job.schema';
import { Model } from 'mongoose';

@Injectable()
export class JobRepository
  implements
    ListJobRepositoryInterface,
    CreateJobRepositoryInterface,
    ReadJobRepositoryInterface,
    UpdateJobRepositoryInterface,
    DeleteJobRepositoryInterface
{
  constructor(
    @InjectModel(JobEntity.name)
    private readonly jobModel: Model<JobDocument>,
  ) {}

  async create(data: JobPayload): Promise<JobRecord> {
    try {
      const job = await this.jobModel.create(data);

      return this.toRecord(job);
    } catch (error) {
      this.handleDuplicateKeyError(error);
      throw error;
    }
  }

  async list(): Promise<JobRecord[]> {
    const jobs = await this.jobModel.find().exec();

    return jobs.map((job) => this.toRecord(job));
  }

  async findById(id: string): Promise<JobRecord | null> {
    const job = await this.jobModel.findById(id).exec();

    return job ? this.toRecord(job) : null;
  }

  async update(
    id: string,
    data: UpdateJobPayload,
  ): Promise<JobRecord | null> {
    try {
      const job = await this.jobModel
        .findByIdAndUpdate(id, data, { new: true, runValidators: true })
        .exec();

      return job ? this.toRecord(job) : null;
    } catch (error) {
      this.handleDuplicateKeyError(error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.jobModel.findByIdAndDelete(id).exec();

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

  private toRecord(document: JobDocument): JobRecord {
    return {
      id: document._id.toString(),
      companyId: document.companyId,
      slug: document.slug,
      title: document.title,
      slots: document.slots,
      benefits: document.benefits,
      isPaidAdvertising: document.isPaidAdvertising,
      role: document.role,
      status: document.status,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }
}
