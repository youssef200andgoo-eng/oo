import { Injectable, NotFoundException, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance, AttendanceStatus, AttendanceMethod } from './attendance.entity';

@Injectable()
export class AttendanceService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedAttendance();
  }

  async seedAttendance() {
    const count = await this.attendanceRepository.count();
    if (count === 0) {
      const sample = this.attendanceRepository.create({
        id: '66666666-7777-8888-9999-000000000000',
        enrollmentId: '44444444-5555-6666-7777-888888888888',
        studentId: '11111111-2222-3333-4444-555555555555',
        courseId: '33333333-4444-5555-6666-777777777777',
        date: new Date(),
        weekNumber: 1,
        sessionNumber: 1,
        status: AttendanceStatus.PRESENT,
        method: AttendanceMethod.QR_CODE,
        checkInTime: '09:00:00',
      });
      await this.attendanceRepository.save(sample);
      console.log('Sample attendance record seeded successfully ✅');
    }
  }

  async findAll(): Promise<Attendance[]> {
    return this.attendanceRepository.find();
  }

  async findOne(id: string): Promise<Attendance | null> {
    return this.attendanceRepository.findOne({ where: { id } });
  }

  async findByStudent(studentId: string): Promise<Attendance[]> {
    return this.attendanceRepository.find({ where: { studentId } });
  }

  async findByCourse(courseId: string): Promise<Attendance[]> {
    return this.attendanceRepository.find({ where: { courseId } });
  }

  async create(createDto: any): Promise<Attendance> {
    const record = this.attendanceRepository.create(createDto as Partial<Attendance>);
    return this.attendanceRepository.save(record);
  }

  async update(id: string, updateDto: Partial<Attendance>): Promise<Attendance> {
    const record = await this.findOne(id);
    if (!record) {
      throw new NotFoundException(`Attendance record with ID ${id} not found`);
    }
    Object.assign(record, updateDto);
    return this.attendanceRepository.save(record);
  }

  async remove(id: string): Promise<void> {
    const record = await this.findOne(id);
    if (!record) {
      throw new NotFoundException(`Attendance record with ID ${id} not found`);
    }
    await this.attendanceRepository.remove(record);
  }
}
