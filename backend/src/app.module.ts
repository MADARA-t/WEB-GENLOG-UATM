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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL, // ← Utilisation de la variable unique
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Nest crée les tables si elles n'existent pas
      logging: true,
      ssl: {
        rejectUnauthorized: false, // Obligatoire pour DB externe sur Render
      },
    }),
    AuthModule,
    UsersModule,
    PromotionsModule,
    PedagogicalSpacesModule,
    EmailModule,
    StudentPromotionsModule,
    SpaceStudentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
