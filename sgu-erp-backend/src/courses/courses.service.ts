import { Injectable, NotFoundException, ConflictException, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course, CourseType } from './course.entity';

@Injectable()
export class CoursesService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedCourses();
  }

  async seedCourses() {
    const count = await this.courseRepository.count();
    if (count === 0) {
      const sampleCourse = this.courseRepository.create({
        id: '33333333-4444-5555-6666-777777777777',
        courseCode: 'CS101',
        courseNameEn: 'Introduction to Computer Science',
        courseNameAr: 'مقدمة في علوم الحاسب',
        collegeId: 'c1111111-1111-1111-1111-111111111111',
        departmentId: 'd1111111-1111-1111-1111-111111111111',
        credits: 3,
        hoursPerWeek: 4,
        lectureHours: 2,
        labHours: 2,
        level: 1,
        semester: 1,
        description: 'Fundamentals of programming, algorithms, and computing concepts.',
        courseType: CourseType.THEORETICAL,
        maxStudents: 60,
        status: 'active',
      });
      await this.courseRepository.save(sampleCourse);
      console.log('Sample course seeded successfully ✅');
    }
  }

  async findAll(): Promise<Course[]> {
    return this.courseRepository.find();
  }

  async findOne(id: string): Promise<Course | null> {
    return this.courseRepository.findOne({ where: { id } });
  }

  async findByCode(courseCode: string): Promise<Course | null> {
    return this.courseRepository.findOne({ where: { courseCode } });
  }

  async create(createDto: any): Promise<Course> {
    if (createDto.courseCode) {
      const existing = await this.findByCode(createDto.courseCode);
      if (existing) {
        throw new ConflictException('Course code already exists');
      }
    }
    const course = this.courseRepository.create(createDto as Partial<Course>);
    return this.courseRepository.save(course);
  }

  async update(id: string, updateDto: Partial<Course>): Promise<Course> {
    const course = await this.findOne(id);
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    Object.assign(course, updateDto);
    return this.courseRepository.save(course);
  }

  async remove(id: string): Promise<void> {
    const course = await this.findOne(id);
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    await this.courseRepository.remove(course);
  }
}
