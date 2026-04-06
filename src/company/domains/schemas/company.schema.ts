import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CompanyStatusEnum } from '@src/company/applications/contracts/company-status.enum';
import { CompanyRoleEnum } from '@src/company/applications/contracts/company-role.enum';

export type CompanyDocument = HydratedDocument<CompanyEntity>;

@Schema({
  collection: 'companies',
  timestamps: true,
})
export class CompanyEntity {
  @Prop({ required: true, trim: true, unique: true })
  slug!: string;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({
    type: {
      street: { type: String, required: true, trim: true },
      number: { type: String, required: true, trim: true },
      neighborhood: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      country: { type: String, required: true, trim: true },
    },
    required: true,
  })
  address!: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
  };

  @Prop({
    type: {
      facebook: { type: String, required: false, trim: true },
      instagram: { type: String, required: false, trim: true },
      linkedin: { type: String, required: false, trim: true },
      twitter: { type: String, required: false, trim: true },
    },
    required: false,
    default: {},
  })
  social?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };

  @Prop({
    required: true,
    enum: CompanyRoleEnum,
    type: String,
    default: CompanyRoleEnum.MAIN,
  })
  role!: CompanyRoleEnum;

  @Prop({ type: String, required: false, trim: true, default: null })
  logo?: string | null;

  @Prop({ type: String, required: false, trim: true, default: null })
  cover?: string | null;

  @Prop({
    required: true,
    enum: CompanyStatusEnum,
    type: String,
    default: CompanyStatusEnum.ACTIVE,
  })
  status!: CompanyStatusEnum;

  createdAt?: Date;
  updatedAt?: Date;
}

export const CompanySchema = SchemaFactory.createForClass(CompanyEntity);
