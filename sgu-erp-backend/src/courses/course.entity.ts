import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum CourseType {
  THEORETICAL = 'theoretical',
  PRACTICAL = 'practical',
  LAB = 'lab',
  SEMINAR = 'seminar',
  PROJECT = 'project',
}

@Entity('courses')
@Index(['courseCode'], { unique: true })
@Index(['collegeId'])
@Index(['departmentId'])
@Index(['level'])
@Index(['semester'])
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  courseCode: string;

  @Column({ type: 'varchar', length: 255 })
  courseNameAr: string;

  @Column({ type: 'varchar', length: 255 })
  courseNameEn: string;

  @Column({ type: 'uuid' })
  collegeId: string;

  @Column({ type: 'uuid' })
  departmentId: string;

  @Column({ type: 'int', default: 3 })
  credits: number;

  @Column({ type: 'int', default: 3 })
  hoursPerWeek: number;

  @Column({ type: 'int', default: 2 })
  lectureHours: number;

  @Column({ type: 'int', default: 1 })
  labHours: number;

  @Column({ type: 'int', default: 0 })
  tutorialHours: number;

  @Column({ type: 'int' })
  level: number;

  @Column({ type: 'int' })
  semester: number;

  @Column({ type: 'simple-array', nullable: true })
  prerequisites: string[];

  @Column({ type: 'simple-array', nullable: true })
  corequisites: string[];

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  objectives: string;

  @Column({ type: 'enum', enum: CourseType, default: CourseType.THEORETICAL })
  courseType: CourseType;

  @Column({ type: 'int', default: 50 })
  maxStudents: number;

  @Column({ type: 'int', default: 10 })
  minStudents: number;

  @Column({ type: 'boolean', default: false })
  isElective: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  textbook: string;

  @Column({ type: 'text', nullable: true })
  references: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  syllabusUrl: string;

  @Column({ type: 'simple-json', nullable: true })
  learningOutcomes: any[];

  @Column({ type: 'simple-json', nullable: true })
  assessmentMethods: any[];

  @Column({ type: 'varchar', length: 50, default: 'active' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
