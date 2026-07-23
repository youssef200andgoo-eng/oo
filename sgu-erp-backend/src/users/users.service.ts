import { Injectable, NotFoundException, ConflictException, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus } from './user.entity';

@Injectable()
export class UsersService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedAdminUser();
  }

  async seedAdminUser() {
    const adminEmail = 'admin@sgu.edu.eg';
    const existing = await this.findByEmail(adminEmail);
    if (!existing) {
      const adminUser = {
        id: 'e2b10a24-9dfc-4014-a957-c373685e13d1',
        universityId: 'd4a94639-653a-4428-bc88-918b8f2d506a',
        email: adminEmail,
        passwordHash: '$2b$12$uVNPt9a3RQd4b/QKReO.6OxCtzFKlJ8.xWnMZ0nFSadXnyqHRwpIi', // Admin@SGU2026!
        firstName: 'System',
        lastName: 'Admin',
        role: 'super_admin',
        status: UserStatus.ACTIVE,
        failedLoginAttempts: 0,
      };
      await this.userRepository.save(this.userRepository.create(adminUser as Partial<User>));
      console.log('Admin user seeded successfully ✅');
    }
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(createUserDto: any): Promise<User> {
    const existing = await this.findByEmail(createUserDto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const user = this.userRepository.create(createUserDto as Partial<User>);
    return this.userRepository.save(user);
  }

  async update(id: string, updateData: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    Object.assign(user, updateData);
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.userRepository.remove(user);
  }

  async incrementFailedLoginAttempts(user: User): Promise<void> {
    user.failedLoginAttempts += 1;
    if (user.failedLoginAttempts >= 5) {
      user.status = UserStatus.LOCKED;
      user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // lock for 15 minutes
    }
    await this.userRepository.save(user);
  }

  async resetFailedLoginAttempts(user: User): Promise<void> {
    user.failedLoginAttempts = 0;
    user.lockedUntil = null;
    if (user.status === UserStatus.LOCKED) {
      user.status = UserStatus.ACTIVE;
    }
    await this.userRepository.save(user);
  }
}
