import { Injectable, NotFoundException, ConflictException, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grade, GradeStatus } from './grade.entity';

@Injectable()
export class GradesService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Grade)
    private readonly gradeRepository: Repository<Grade>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedGrades();
  }

  async seedGrades() {
    const count = await this.gradeRepository.count();
    if (count === 0) {
      const sample = this.gradeRepository.create({
        id: '55555555-6666-7777-8888-999999999999',
        enrollmentId: '44444444-5555-6666-7777-888888888888',
        studentId: '11111111-2222-3333-4444-555555555555',
        courseId: '33333333-4444-5555-6666-777777777777',
        semesterId: 'sem-2026-fall',
        midtermGrade: 28,
        finalGrade: 37,
        practicalGrade: 19,
        quizGrade: 5,
        homeworkGrade: 5,
        totalGrade: 94,
        gradeLetter: 'A',
        gradePoints: 4.0,
        status: GradeStatus.PUBLISHED,
      });
      await this.gradeRepository.save(sample);
      console.log('Sample grade seeded successfully ✅');
    }
  }

  async findAll(): Promise<Grade[]> {
    return this.gradeRepository.find();
  }

  async findOne(id: string): Promise<Grade | null> {
    return this.gradeRepository.findOne({ where: { id } });
  }

  async findByStudent(studentId: string): Promise<Grade[]> {
    return this.gradeRepository.find({ where: { studentId } });
  }

  async findByCourse(courseId: string): Promise<Grade[]> {
    return this.gradeRepository.find({ where: { courseId } });
  }

  async create(createDto: any): Promise<Grade> {
    const existing = await this.gradeRepository.findOne({ where: { enrollmentId: createDto.enrollmentId } });
    if (existing) {
      throw new ConflictException('Grade record for this enrollment already exists');
    }
    const grade = this.gradeRepository.create(createDto as Partial<Grade>);
    return this.gradeRepository.save(grade);
  }

  async update(id: string, updateDto: Partial<Grade>): Promise<Grade> {
    const grade = await this.findOne(id);
    if (!grade) {
      throw new NotFoundException(`Grade with ID ${id} not found`);
    }
    Object.assign(grade, updateDto);
    return this.gradeRepository.save(grade);
  }

  async remove(id: string): Promise<void> {
    const grade = await this.findOne(id);
    if (!grade) {
      throw new NotFoundException(`Grade with ID ${id} not found`);
    }
    await this.gradeRepository.remove(grade);
  }
}
