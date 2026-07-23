import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

export enum StudentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  GRADUATED = 'graduated',
  WITHDRAWN = 'withdrawn',
  TRANSFERRED = 'transferred',
  FROZEN = 'frozen',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export enum BloodType {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-',
}

@Entity('students')
@Index(['studentId'], { unique: true })
@Index(['userId'], { unique: true })
@Index(['collegeId'])
@Index(['departmentId'])
@Index(['status'])
@Index(['enrollmentYear'])
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  userId: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', length: 20, unique: true })
  studentId: string;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ type: 'date' })
  birthDate: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nationality: string;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ type: 'varchar', length: 100 })
  governorate: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  postalCode: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  emergencyContactName: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  emergencyContactPhone: string;

  @Column({ type: 'enum', enum: BloodType, nullable: true })
  bloodType: BloodType;

  @Column({ type: 'text', nullable: true })
  medicalConditions: string;

  @Column({ type: 'text', nullable: true })
  disabilities: string;

  @Column({ type: 'uuid' })
  collegeId: string;

  @Column({ type: 'uuid' })
  departmentId: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  program: string;

  @Column({ type: 'int', default: 1 })
  currentLevel: number;

  @Column({ type: 'int', default: 1 })
  currentSemester: number;

  @Column({ type: 'date' })
  enrollmentDate: Date;

  @Column({ type: 'int' })
  enrollmentYear: number;

  @Column({ type: 'date', nullable: true })
  expectedGraduationDate: Date;

  @Column({ type: 'date', nullable: true })
  actualGraduationDate: Date;

  @Column({ type: 'enum', enum: StudentStatus, default: StudentStatus.ACTIVE })
  status: StudentStatus;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0.00 })
  gpa: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0.00 })
  cgpa: number;

  @Column({ type: 'int', default: 0 })
  totalCredits: number;

  @Column({ type: 'int', default: 0 })
  completedCredits: number;

  @Column({ type: 'int', default: 0 })
  remainingCredits: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  tuitionFees: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  paidFees: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  remainingFees: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  scholarshipType: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.00 })
  discountPercent: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  guardianName: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  guardianPhone: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  guardianRelation: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  guardianJob: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  guardianAddress: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  highSchoolName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  highSchoolGovernorate: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  highSchoolPercentage: number;

  @Column({ type: 'int', nullable: true })
  highSchoolYear: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  thanaweyaType: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  profilePicture: string;

  @Column({ type: 'simple-json', nullable: true })
  academicHistory: any[];

  @Column({ type: 'simple-json', nullable: true })
  disciplinaryRecords: any[];

  @Column({ type: 'simple-json', nullable: true })
  documents: any[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
