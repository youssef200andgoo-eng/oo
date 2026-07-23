import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

export enum AuditAction {
  LOGIN_SUCCESS = 'login_success',
  LOGIN_FAILED = 'login_failed',
  LOGOUT = 'logout',
  LOGOUT_ALL_DEVICES = 'logout_all_devices',
  PASSWORD_CHANGED = 'password_changed',
  PASSWORD_RESET_REQUESTED = 'password_reset_requested',
  PASSWORD_RESET_COMPLETED = 'password_reset_completed',
  TWO_FACTOR_ENABLED = 'two_factor_enabled',
  TWO_FACTOR_DISABLED = 'two_factor_disabled',
  TWO_FACTOR_FAILED = 'two_factor_failed',
  LOGIN_2FA_REQUIRED = 'login_2fa_required',
  PROFILE_UPDATED = 'profile_updated',
  EMAIL_VERIFIED = 'email_verified',
  ACCOUNT_CREATED = 'account_created',
  ACCOUNT_UPDATED = 'account_updated',
  ACCOUNT_DELETED = 'account_deleted',
  ACCOUNT_LOCKED = 'account_locked',
  ACCOUNT_UNLOCKED = 'account_unlocked',
  PERMISSION_CHANGED = 'permission_changed',
  ROLE_CHANGED = 'role_changed',
  DATA_EXPORTED = 'data_exported',
  DATA_IMPORTED = 'data_imported',
  GRADE_ENTERED = 'grade_entered',
  GRADE_MODIFIED = 'grade_modified',
  GRADE_PUBLISHED = 'grade_published',
  ENROLLMENT_CREATED = 'enrollment_created',
  ENROLLMENT_DROPPED = 'enrollment_dropped',
  FEE_PAID = 'fee_paid',
  FEE_WAIVED = 'fee_waived',
  ATTENDANCE_MARKED = 'attendance_marked',
  ATTENDANCE_MODIFIED = 'attendance_modified',
  BOOK_BORROWED = 'book_borrowed',
  BOOK_RETURNED = 'book_returned',
  NOTIFICATION_SENT = 'notification_sent',
  API_KEY_GENERATED = 'api_key_generated',
  API_KEY_REVOKED = 'api_key_revoked',
  BACKUP_CREATED = 'backup_created',
  BACKUP_RESTORED = 'backup_restored',
  SETTINGS_CHANGED = 'settings_changed',
  INTEGRATION_CONNECTED = 'integration_connected',
  INTEGRATION_DISCONNECTED = 'integration_disconnected',
}

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

@Entity('audit_logs')
@Index(['userId'])
@Index(['action'])
@Index(['entityType'])
@Index(['entityId'])
@Index(['riskLevel'])
@Index(['ipAddress'])
@Index(['createdAt'])
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @Column({ type: 'enum', enum: AuditAction })
  action: AuditAction;

  @Column({ type: 'varchar', length: 50 })
  entityType: string;

  @Column({ type: 'uuid', nullable: true })
  entityId: string;

  @Column({ type: 'simple-json', nullable: true })
  oldValues: any;

  @Column({ type: 'simple-json', nullable: true })
  newValues: any;

  @Column({ type: 'simple-json', nullable: true })
  metadata: any;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  userAgent: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  sessionId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  requestId: string;

  @Column({ type: 'enum', enum: RiskLevel, default: RiskLevel.LOW })
  riskLevel: RiskLevel;

  @Column({ type: 'text', nullable: true })
  riskReason: string;

  @Column({ type: 'boolean', default: false })
  isAnomaly: boolean;

  @Column({ type: 'varchar', length: 64, nullable: true })
  integrityHash: string;

  @CreateDateColumn()
  createdAt: Date;
}
