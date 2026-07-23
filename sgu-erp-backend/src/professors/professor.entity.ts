import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum ProfessorDegree {
  BACHELOR = 'bachelor',
  MASTER = 'master',
  PHD = 'phd',
  PROFESSOR = 'professor',
  ASSOCIATE_PROFESSOR = 'associate_professor',
  ASSISTANT_PROFESSOR = 'assistant_professor',
  LECTURER = 'lecturer',
  ASSISTANT_LECTURER = 'assistant_lecturer',
}

export enum EmploymentType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  VISITING = 'visiting',
}

@Entity('professors')
@Index(['professorId'], { unique: true })
@Index(['userId'], { unique: true })
@Index(['collegeId'])
@Index(['departmentId'])
@Index(['degree'])
export class Professor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  userId: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  professorId: string;

  @Column({ type: 'varchar', length: 255 })
  specialization: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  subSpecialization: string;

  @Column({ type: 'enum', enum: ProfessorDegree })
  degree: ProfessorDegree;

  @Column({ type: 'varchar', length: 255, nullable: true })
  universityDegree: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  phdThesisTitle: string;

  @Column({ type: 'int', nullable: true })
  phdYear: number;

  @Column({ type: 'date' })
  hireDate: Date;

  @Column({ type: 'enum', enum: EmploymentType, default: EmploymentType.FULL_TIME })
  employmentType: EmploymentType;

  @Column({ type: 'varchar', length: 50, nullable: true })
  contractType: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  salary: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  bonus: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  totalSalary: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  bankName: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  bankAccount: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  iban: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  officeLocation: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  officePhone: string;

  @Column({ type: 'text', nullable: true })
  researchInterests: string;

  @Column({ type: 'int', default: 0 })
  publicationsCount: number;

  @Column({ type: 'int', default: 0 })
  hIndex: number;

  @Column({ type: 'simple-json', nullable: true })
  coursesTeaching: any[];

  @Column({ type: 'int', default: 0 })
  weeklyHours: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  cvUrl: string;

  @Column({ type: 'uuid' })
  collegeId: string;

  @Column({ type: 'uuid' })
  departmentId: string;

  @Column({ type: 'varchar', length: 50, default: 'active' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
