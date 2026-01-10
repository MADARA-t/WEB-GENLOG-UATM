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
    // On n’a pas besoin de envFilePath sur Render
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,       // Render Postgres host
      port: Number(process.env.DATABASE_PORT), // 5432
      username: process.env.DATABASE_USER,   // Render DB user
      password: process.env.DATABASE_PASSWORD, // Render DB password
      database: process.env.DATABASE_NAME,   // Render DB name
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,  // ⚠️ Ne jamais mettre true en prod
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
