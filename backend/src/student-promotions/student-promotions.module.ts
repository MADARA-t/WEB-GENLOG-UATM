import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentPromotionsController } from './student-promotions.controller';
import { StudentPromotionsService } from './student-promotions.service';
import { StudentPromotion } from '../users/entities/student-promotion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudentPromotion])],
  controllers: [StudentPromotionsController],
  providers: [StudentPromotionsService],
})
export class StudentPromotionsModule {}