import { Injectable, NotFoundException, ConflictException, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment, EnrollmentStatus, EnrollmentType } from './enrollment.entity';

@Injectable()
export class EnrollmentsService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedEnrollments();
  }

  async seedEnrollments() {
    const count = await this.enrollmentRepository.count();
    if (count === 0) {
      const sample = this.enrollmentRepository.create({
        id: '44444444-5555-6666-7777-888888888888',
        studentId: '11111111-2222-3333-4444-555555555555',
        courseId: '33333333-4444-5555-6666-777777777777',
        semesterId: 'sem-2026-fall',
        enrollmentDate: new Date('2026-02-01'),
        enrollmentType: EnrollmentType.REGULAR,
        status: EnrollmentStatus.ACTIVE,
        attendancePercent: 95.5,
      });
      await this.enrollmentRepository.save(sample);
      console.log('Sample enrollment seeded successfully ✅');
    }
  }

  async findAll(): Promise<Enrollment[]> {
    return this.enrollmentRepository.find({ relations: ['student', 'course'] });
  }

  async findOne(id: string): Promise<Enrollment | null> {
    return this.enrollmentRepository.findOne({ where: { id }, relations: ['student', 'course'] });
  }

  async findByStudent(studentId: string): Promise<Enrollment[]> {
    return this.enrollmentRepository.find({ where: { studentId }, relations: ['course'] });
  }

  async create(createDto: any): Promise<Enrollment> {
    const existing = await this.enrollmentRepository.findOne({
      where: {
        studentId: createDto.studentId,
        courseId: createDto.courseId,
        semesterId: createDto.semesterId,
      },
    });
    if (existing) {
      throw new ConflictException('Student is already enrolled in this course for this semester');
    }

    const enrollment = this.enrollmentRepository.create(createDto as Partial<Enrollment>);
    return this.enrollmentRepository.save(enrollment);
  }

  async update(id: string, updateDto: Partial<Enrollment>): Promise<Enrollment> {
    const enrollment = await this.findOne(id);
    if (!enrollment) {
      throw new NotFoundException(`Enrollment with ID ${id} not found`);
    }
    Object.assign(enrollment, updateDto);
    return this.enrollmentRepository.save(enrollment);
  }

  async remove(id: string): Promise<void> {
    const enrollment = await this.findOne(id);
    if (!enrollment) {
      throw new NotFoundException(`Enrollment with ID ${id} not found`);
    }
    await this.enrollmentRepository.remove(enrollment);
  }
}
