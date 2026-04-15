import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import apiConfig from '@src/config/api.config';
import { ConfigModule } from '@nestjs/config';
import { HealthCheckModule } from '@src/health-check/health-check.module';

const databaseUri = process.env.DATABASE_URI;
const importedModules = [HealthCheckModule];
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
