import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import apiConfig from '@src/config/api.config';
import { ConfigModule } from '@nestjs/config';
import { HealthCheckModule } from '@src/health-check/health-check.module';
import { CompanyModule } from '@src/company/company.module';
import { JobModule } from '@src/job/job.module';
import { ApplyModule } from '@src/apply/apply.module';

const databaseUri = process.env.DATABASE_URI;
const importedModules = [
  HealthCheckModule,
  CompanyModule,
  JobModule,
  ApplyModule,
];
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [apiConfig],
      isGlobal: true,
    }),
    ...(databaseUri
      ? [
          MongooseModule.forRoot(databaseUri, {
            dbName: process.env.DATABASE_NAME,
          }),
        ]
      : []),
    ...importedModules,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
