import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApplyStatusEnum } from '@src/apply/applications/contracts/apply-status.enum';

export type ApplyDocument = HydratedDocument<ApplyEntity>;

@Schema({
  collection: 'applies',
  timestamps: true,
})
export class ApplyEntity {
  @Prop({ required: true, trim: true })
  companyId!: string;

  @Prop({ required: true, trim: true })
  jobId!: string;

  @Prop({ required: true, trim: true })
  userId!: string;

  @Prop({
    required: true,
    enum: ApplyStatusEnum,
    type: String,
    default: ApplyStatusEnum.ACTIVE,
  })
  status!: ApplyStatusEnum;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ApplySchema = SchemaFactory.createForClass(ApplyEntity);
