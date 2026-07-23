import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum GradeStatus {
  PENDING = 'pending',
  ENTERED = 'entered',
  VERIFIED = 'verified',
  PUBLISHED = 'published',
  APPEALED = 'appealed',
}

@Entity('grades')
@Index(['enrollmentId'], { unique: true })
@Index(['studentId'])
@Index(['courseId'])
@Index(['semesterId'])
export class Grade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  enrollmentId: string;

  @Column({ type: 'uuid' })
  studentId: string;

  @Column({ type: 'uuid' })
  courseId: string;

  @Column({ type: 'uuid', nullable: true })
  sectionId: string;

  @Column({ type: 'uuid' })
  semesterId: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  midtermGrade: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 30.00 })
  midtermPercent: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  finalGrade: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 40.00 })
  finalPercent: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  practicalGrade: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 20.00 })
  practicalPercent: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  quizGrade: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 5.00 })
  quizPercent: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  homeworkGrade: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 5.00 })
  homeworkPercent: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  projectGrade: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.00 })
  projectPercent: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  participationGrade: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.00 })
  participationPercent: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  bonusGrade: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  totalGrade: number;

  @Column({ type: 'varchar', length: 5, nullable: true })
  gradeLetter: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  gradePoints: number;

  @Column({ type: 'uuid', nullable: true })
  enteredBy: string;

  @Column({ type: 'uuid', nullable: true })
  verifiedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  entryDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  verificationDate: Date;

  @Column({ type: 'enum', enum: GradeStatus, default: GradeStatus.PENDING })
  status: GradeStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'boolean', default: false })
  isAppealed: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  appealStatus: string;

  @Column({ type: 'text', nullable: true })
  appealReason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
