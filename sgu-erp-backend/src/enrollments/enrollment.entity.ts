import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { Student } from '../students/student.entity';
import { Course } from '../courses/course.entity';

export enum EnrollmentStatus {
  ACTIVE = 'active',
  DROPPED = 'dropped',
  WITHDRAWN = 'withdrawn',
  COMPLETED = 'completed',
  INCOMPLETE = 'incomplete',
}

export enum EnrollmentType {
  REGULAR = 'regular',
  SUMMER = 'summer',
  REMEDIAL = 'remedial',
  TRANSFER = 'transfer',
}

@Entity('enrollments')
@Index(['studentId', 'courseId', 'semesterId'], { unique: true })
@Index(['studentId'])
@Index(['courseId'])
@Index(['status'])
export class Enrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  studentId: string;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @Column({ type: 'uuid' })
  courseId: string;

  @ManyToOne(() => Course)
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @Column({ type: 'uuid', nullable: true })
  sectionId: string;

  @Column({ type: 'uuid' })
  semesterId: string;

  @Column({ type: 'date' })
  enrollmentDate: Date;

  @Column({ type: 'enum', enum: EnrollmentType, default: EnrollmentType.REGULAR })
  enrollmentType: EnrollmentType;

  @Column({ type: 'enum', enum: EnrollmentStatus, default: EnrollmentStatus.ACTIVE })
  status: EnrollmentStatus;

  @Column({ type: 'varchar', length: 5, nullable: true })
  grade: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  gradePoints: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.00 })
  attendancePercent: number;

  @Column({ type: 'date', nullable: true })
  droppedDate: Date;

  @Column({ type: 'text', nullable: true })
  dropReason: string;

  @Column({ type: 'simple-json', nullable: true })
  metadata: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
