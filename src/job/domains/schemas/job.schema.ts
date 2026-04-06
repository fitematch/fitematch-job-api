import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { JobRoleEnum } from '@src/job/applications/contracts/job-role.enum';
import { JobStatusEnum } from '@src/job/applications/contracts/job-status.enum';

export type JobDocument = HydratedDocument<JobEntity>;

@Schema({
  collection: 'jobs',
  timestamps: true,
})
export class JobEntity {
  @Prop({ required: true, trim: true })
  companyId!: string;

  @Prop({ required: true, trim: true, unique: true })
  slug!: string;

  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ required: true, min: 1 })
  slots!: number;

  @Prop({
    type: {
      salary: { type: Number, required: false, default: null, min: 0 },
      transportation: { type: Boolean, required: true },
      alimentation: { type: Boolean, required: true },
      health: { type: Boolean, required: true },
      parking: { type: Boolean, required: true },
      bonus: { type: String, required: true, trim: true },
    },
    required: true,
  })
  benefits!: {
    salary?: number | null;
    transportation: boolean;
    alimentation: boolean;
    health: boolean;
    parking: boolean;
    bonus: string;
  };

  @Prop({ type: Boolean, required: false, trim: true, default: false })
  isPaidAdvertising?: boolean;

  @Prop({
    required: true,
    enum: JobRoleEnum,
    type: String,
  })
  role!: JobRoleEnum;

  @Prop({
    required: true,
    enum: JobStatusEnum,
    type: String,
  })
  status!: JobStatusEnum;

  createdAt?: Date;
  updatedAt?: Date;
}

export const JobSchema = SchemaFactory.createForClass(JobEntity);
