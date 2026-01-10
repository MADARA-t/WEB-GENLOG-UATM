import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PromotionsModule } from './promotions/promotions.module';
import { PedagogicalSpacesModule } from './pedagogical-spaces/pedagogical-spaces.module';
import { EmailModule } from './email/email.module';
import { StudentPromotionsModule } from './student-promotions/student-promotions.module';
import { SpaceStudentsModule } from './space-students/space-students.module';
import { WorksModule } from './works/works.module';
import { WorkSubmissionsModule } from './work-submissions/work-submissions.module';
import { WorkAssignmentsModule } from './work-assignments/work-assignments.module';
import { WorkEvaluationsModule } from './work-evaluations/work-evaluations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true,

      ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
    }),

    AuthModule,
    UsersModule,
    PromotionsModule,
    PedagogicalSpacesModule,
    EmailModule,
    StudentPromotionsModule,
    SpaceStudentsModule,
    WorksModule,
    WorkSubmissionsModule,
    WorkAssignmentsModule,
    WorkEvaluationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
