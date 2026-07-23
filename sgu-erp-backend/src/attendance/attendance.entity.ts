import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late',
  EXCUSED = 'excused',
  MEDICAL = 'medical',
}

export enum AttendanceMethod {
  MANUAL = 'manual',
  QR_CODE = 'qr_code',
  NFC = 'nfc',
  RFID = 'rfid',
  FACE_RECOGNITION = 'face_recognition',
  GPS = 'gps',
  BIOMETRIC = 'biometric',
}

@Entity('attendance')
@Index(['studentId', 'courseId', 'date'])
@Index(['enrollmentId'])
@Index(['date'])
@Index(['status'])
export class Attendance {
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

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'int', nullable: true })
  weekNumber: number;

  @Column({ type: 'int', nullable: true })
  sessionNumber: number;

  @Column({ type: 'enum', enum: AttendanceStatus, default: AttendanceStatus.ABSENT })
  status: AttendanceStatus;

  @Column({ type: 'enum', enum: AttendanceMethod, default: AttendanceMethod.MANUAL })
  method: AttendanceMethod;

  @Column({ type: 'time', nullable: true })
  checkInTime: string;

  @Column({ type: 'time', nullable: true })
  checkOutTime: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  deviceId: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  faceRecognitionData: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'uuid', nullable: true })
  enteredBy: string;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ type: 'uuid', nullable: true })
  verifiedBy: string;

  @CreateDateColumn()
  createdAt: Date;
}
