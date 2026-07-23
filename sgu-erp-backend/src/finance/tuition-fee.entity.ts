import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum FeeStatus {
  UNPAID = 'unpaid',
  PARTIAL = 'partial',
  PAID = 'paid',
  OVERDUE = 'overdue',
  WAIVED = 'waived',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  CASH = 'cash',
  BANK_TRANSFER = 'bank_transfer',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  FAWRY = 'fawry',
  PAYMOB = 'paymob',
  VODAFONE_CASH = 'vodafone_cash',
  ETISALAT_CASH = 'etisalat_cash',
  ORANGE_CASH = 'orange_cash',
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
  INSTALLMENT = 'installment',
}

@Entity('tuition_fees')
@Index(['studentId', 'semesterId'])
@Index(['status'])
@Index(['dueDate'])
@Index(['transactionId'], { unique: true })
export class TuitionFee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  studentId: string;

  @Column({ type: 'uuid' })
  semesterId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  discountAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  penaltyAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  paidAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  remainingAmount: number;

  @Column({ type: 'date', nullable: true })
  paymentDate: Date;

  @Column({ type: 'enum', enum: PaymentMethod, nullable: true })
  paymentMethod: PaymentMethod;

  @Column({ type: 'varchar', length: 100, nullable: true })
  transactionId: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  receiptNumber: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  bankName: string;

  @Column({ type: 'enum', enum: FeeStatus, default: FeeStatus.UNPAID })
  status: FeeStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'simple-json', nullable: true })
  paymentDetails: any;

  @Column({ type: 'uuid', nullable: true })
  processedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
