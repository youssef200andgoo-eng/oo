import { Injectable, NotFoundException, ConflictException, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student, StudentStatus, Gender, BloodType } from './student.entity';

@Injectable()
export class StudentsService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedStudents();
  }

  async seedStudents() {
    const count = await this.studentRepository.count();
    if (count === 0) {
      const sampleStudent = this.studentRepository.create({
        id: '11111111-2222-3333-4444-555555555555',
        userId: 'e2b10a24-9dfc-4014-a957-c373685e13d1',
        studentId: 'SGU2026001',
        gender: Gender.MALE,
        birthDate: new Date('2003-05-15'),
        nationality: 'Egyptian',
        address: '123 University Street',
        city: 'Sixth of October',
        governorate: 'Giza',
        postalCode: '12511',
        collegeId: 'c1111111-1111-1111-1111-111111111111',
        departmentId: 'd1111111-1111-1111-1111-111111111111',
        program: 'Computer Science',
        currentLevel: 3,
        currentSemester: 5,
        enrollmentDate: new Date('2023-09-01'),
        enrollmentYear: 2023,
        status: StudentStatus.ACTIVE,
        gpa: 3.85,
        cgpa: 3.80,
        totalCredits: 132,
        completedCredits: 75,
        remainingCredits: 57,
        tuitionFees: 45000,
        paidFees: 45000,
        remainingFees: 0,
      });
      await this.studentRepository.save(sampleStudent);
      console.log('Sample student seeded successfully ✅');
    }
  }

  async findAll(): Promise<Student[]> {
    return this.studentRepository.find({ relations: ['user'] });
  }

  async findOne(id: string): Promise<Student | null> {
    return this.studentRepository.findOne({ where: { id }, relations: ['user'] });
  }

  async findByStudentId(studentId: string): Promise<Student | null> {
    return this.studentRepository.findOne({ where: { studentId }, relations: ['user'] });
  }

  async findByUserId(userId: string): Promise<Student | null> {
    return this.studentRepository.findOne({ where: { userId }, relations: ['user'] });
  }

  async create(createDto: any): Promise<Student> {
    if (createDto.studentId) {
      const existing = await this.findByStudentId(createDto.studentId);
      if (existing) {
        throw new ConflictException('Student ID already exists');
      }
    }
    const student = this.studentRepository.create(createDto as Partial<Student>);
    return this.studentRepository.save(student);
  }

  async update(id: string, updateDto: Partial<Student>): Promise<Student> {
    const student = await this.findOne(id);
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    Object.assign(student, updateDto);
    return this.studentRepository.save(student);
  }

  async remove(id: string): Promise<void> {
    const student = await this.findOne(id);
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    await this.studentRepository.remove(student);
  }
}
