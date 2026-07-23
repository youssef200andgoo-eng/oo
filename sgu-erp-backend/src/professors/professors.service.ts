import { Injectable, NotFoundException, ConflictException, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Professor, ProfessorDegree, EmploymentType } from './professor.entity';

@Injectable()
export class ProfessorsService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Professor)
    private readonly professorRepository: Repository<Professor>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedProfessors();
  }

  async seedProfessors() {
    const count = await this.professorRepository.count();
    if (count === 0) {
      const sampleProf = this.professorRepository.create({
        id: '22222222-3333-4444-5555-666666666666',
        userId: 'e2b10a24-9dfc-4014-a957-c373685e13d1',
        professorId: 'P-SGU-001',
        specialization: 'Artificial Intelligence & Software Engineering',
        degree: ProfessorDegree.PROFESSOR,
        hireDate: new Date('2020-01-15'),
        employmentType: EmploymentType.FULL_TIME,
        salary: 35000,
        officeLocation: 'Building A, Room 302',
        collegeId: 'c1111111-1111-1111-1111-111111111111',
        departmentId: 'd1111111-1111-1111-1111-111111111111',
        status: 'active',
      });
      await this.professorRepository.save(sampleProf);
      console.log('Sample professor seeded successfully ✅');
    }
  }

  async findAll(): Promise<Professor[]> {
    return this.professorRepository.find();
  }

  async findOne(id: string): Promise<Professor | null> {
    return this.professorRepository.findOne({ where: { id } });
  }

  async findByProfessorId(professorId: string): Promise<Professor | null> {
    return this.professorRepository.findOne({ where: { professorId } });
  }

  async create(createDto: any): Promise<Professor> {
    if (createDto.professorId) {
      const existing = await this.findByProfessorId(createDto.professorId);
      if (existing) {
        throw new ConflictException('Professor ID already exists');
      }
    }
    const professor = this.professorRepository.create(createDto as Partial<Professor>);
    return this.professorRepository.save(professor);
  }

  async update(id: string, updateDto: Partial<Professor>): Promise<Professor> {
    const professor = await this.findOne(id);
    if (!professor) {
      throw new NotFoundException(`Professor with ID ${id} not found`);
    }
    Object.assign(professor, updateDto);
    return this.professorRepository.save(professor);
  }

  async remove(id: string): Promise<void> {
    const professor = await this.findOne(id);
    if (!professor) {
      throw new NotFoundException(`Professor with ID ${id} not found`);
    }
    await this.professorRepository.remove(professor);
  }
}
