import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, BeforeInsert, BeforeUpdate } from 'typeorm';
import * as bcrypt from 'bcrypt';

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  STUDENT = 'student',
  PROFESSOR = 'professor',
  TEACHING_ASSISTANT = 'teaching_assistant',
  ACADEMIC_ADVISOR = 'academic_advisor',
  DEPARTMENT_HEAD = 'department_head',
  DEAN = 'dean',
  STUDENT_AFFAIRS = 'student_affairs',
  HR_STAFF = 'hr_staff',
  FINANCE_STAFF = 'finance_staff',
  LIBRARIAN = 'librarian',
  DORM_STAFF = 'dorm_staff',
  SECURITY_STAFF = 'security_staff',
  PARENT = 'parent',
  ALUMNI = 'alumni',
  APPLICANT = 'applicant',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification',
  LOCKED = 'locked',
}

@Entity('users')
@Index(['email'], { unique: true })
@Index(['nationalId'], { unique: true })
@Index(['role'])
@Index(['status'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'university_id', type: 'uuid' })
  universityId: string;

  @Column({ name: 'campus_id', type: 'uuid', nullable: true })
  campusId: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ name: 'first_name_en', type: 'varchar', length: 100 })
  firstName: string;

  @Column({ name: 'last_name_en', type: 'varchar', length: 100 })
  lastName: string;

  @Column({ name: 'first_name_ar', type: 'varchar', length: 100, nullable: true })
  firstNameAr: string;

  @Column({ name: 'last_name_ar', type: 'varchar', length: 100, nullable: true })
  lastNameAr: string;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
  nationalId: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.STUDENT })
  role: UserRole;

  @Column({ type: 'simple-array', nullable: true })
  permissions: string[];

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.PENDING_VERIFICATION })
  status: UserStatus;

  @Column({ name: 'college_id', type: 'uuid', nullable: true })
  collegeId: string;

  @Column({ name: 'department_id', type: 'uuid', nullable: true })
  departmentId: string;

  @Column({ name: 'two_factor_enabled', type: 'boolean', default: false })
  twoFactorEnabled: boolean;

  @Column({ name: 'two_factor_secret', type: 'varchar', length: 255, nullable: true })
  twoFactorSecret: string;

  @Column({ name: 'two_factor_backup_codes', type: 'simple-array', nullable: true })
  twoFactorBackupCodes: string[];

  @Column({ name: 'failed_login_attempts', type: 'int', default: 0 })
  failedLoginAttempts: number;

  @Column({ name: 'locked_until', type: 'timestamp', nullable: true })
  lockedUntil: Date;

  @Column({ name: 'last_login_at', type: 'timestamp', nullable: true })
  lastLoginAt: Date;

  @Column({ name: 'last_login_ip', type: 'varchar', length: 255, nullable: true })
  lastLoginIp: string;

  @Column({ name: 'last_login_device', type: 'text', nullable: true })
  lastLoginDevice: string;

  @Column({ name: 'login_count', type: 'int', default: 0 })
  loginCount: number;

  @Column({ name: 'profile_picture', type: 'varchar', length: 500, nullable: true })
  profilePicture: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  preferredLanguage: string;

  @Column({ type: 'varchar', length: 50, default: 'UTC+2' })
  timezone: string;

  @Column({ type: 'boolean', default: true })
  emailNotifications: boolean;

  @Column({ type: 'boolean', default: true })
  smsNotifications: boolean;

  @Column({ type: 'boolean', default: true })
  pushNotifications: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  resetPasswordToken: string;

  @Column({ type: 'timestamp', nullable: true })
  resetPasswordExpires: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  emailVerificationToken: string;

  @Column({ name: 'email_verified_at', type: 'timestamp', nullable: true })
  emailVerifiedAt: Date;

  @Column({ type: 'varchar', length: 500, nullable: true })
  apiKey: string;

  @Column({ type: 'timestamp', nullable: true })
  apiKeyExpiresAt: Date;

  @Column({ name: 'password_changed_at', type: 'timestamp', nullable: true })
  passwordChangedAt: Date;

  @Column({ name: 'password_expires_at', type: 'timestamp', nullable: true })
  passwordExpiresAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.passwordHash && !this.passwordHash.startsWith('$2')) {
      this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
    }
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
