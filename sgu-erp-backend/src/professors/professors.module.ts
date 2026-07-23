import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Professor } from './professor.entity';
import { ProfessorsService } from './professors.service';
import { ProfessorsController } from './professors.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Professor])],
  controllers: [ProfessorsController],
  providers: [ProfessorsService],
  exports: [ProfessorsService, TypeOrmModule],
})
export class ProfessorsModule {}
