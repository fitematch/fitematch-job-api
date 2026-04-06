import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreateApplyController } from '@src/apply/adapters/controllers/create-apply.controller';
import { DeleteApplyController } from '@src/apply/adapters/controllers/delete-apply.controller';
import { ListApplyController } from '@src/apply/adapters/controllers/list-apply.controller';
import { ReadApplyController } from '@src/apply/adapters/controllers/read-apply.controller';
import { UpdateApplyController } from '@src/apply/adapters/controllers/update-apply.controller';
import {
  ApplyEntity,
  ApplySchema,
} from '@src/apply/domains/schemas/apply.schema';
import { applyProviders } from '@src/apply/apply.providers';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ApplyEntity.name,
        schema: ApplySchema,
      },
    ]),
  ],
  controllers: [
    ListApplyController,
    CreateApplyController,
    ReadApplyController,
    UpdateApplyController,
    DeleteApplyController,
  ],
  providers: [...applyProviders],
  exports: [...applyProviders, MongooseModule],
})
export class ApplyModule {}
