import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum BookStatus {
  AVAILABLE = 'available',
  BORROWED = 'borrowed',
  RESERVED = 'reserved',
  LOST = 'lost',
  DAMAGED = 'damaged',
  UNDER_MAINTENANCE = 'under_maintenance',
}

@Entity('library_books')
@Index(['isbn'], { unique: true })
@Index(['title'])
@Index(['author'])
@Index(['category'])
@Index(['status'])
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  isbn: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255 })
  titleAr: string;

  @Column({ type: 'varchar', length: 255 })
  author: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  authorAr: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  publisher: string;

  @Column({ type: 'int', nullable: true })
  publishYear: number;

  @Column({ type: 'varchar', length: 100 })
  category: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  subject: string;

  @Column({ type: 'int', default: 1 })
  copiesTotal: number;

  @Column({ type: 'int', default: 1 })
  copiesAvailable: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  shelfLocation: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  coverImage: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  finePerDay: number;

  @Column({ type: 'enum', enum: BookStatus, default: BookStatus.AVAILABLE })
  status: BookStatus;

  @Column({ type: 'simple-json', nullable: true })
  metadata: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
