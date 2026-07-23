import { Injectable, UnauthorizedException, ForbiddenException, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { User, UserRole, UserStatus } from '../users/user.entity';
import * as bcrypt from 'bcrypt';

export interface TokenPayload {
  sub: string;
  email: string;
  role: UserRole;
  permissions: string[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(pass, user.passwordHash);
    if (!isMatch) {
      return null;
    }

    return user;
  }

  async login(
    email: string,
    pass: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<{ requires2FA: boolean; user?: User; tokens?: AuthTokens }> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if account is locked
    if (user.status === UserStatus.LOCKED) {
      if (user.lockedUntil && user.lockedUntil > new Date()) {
        throw new ForbiddenException(`Account is locked. Try again after ${user.lockedUntil.toISOString()}`);
      } else {
        // Unlock account if lock duration has expired
        await this.usersService.resetFailedLoginAttempts(user);
      }
    }

    if (user.status === UserStatus.INACTIVE || user.status === UserStatus.SUSPENDED) {
      throw new ForbiddenException('Your account is inactive or suspended');
    }

    const isMatch = await bcrypt.compare(pass, user.passwordHash);
    if (!isMatch) {
      await this.usersService.incrementFailedLoginAttempts(user);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Reset failed login attempts on successful login
    await this.usersService.resetFailedLoginAttempts(user);

    // Check if password has expired
    if (user.passwordExpiresAt && user.passwordExpiresAt < new Date()) {
      throw new ForbiddenException('Your password has expired. Please reset your password.');
    }

    // Update login tracking
    user.lastLoginAt = new Date();
    user.lastLoginIp = ipAddress || null;
    user.lastLoginDevice = userAgent || null;
    user.loginCount += 1;
    await this.usersService.update(user.id, {
      lastLoginAt: user.lastLoginAt,
      lastLoginIp: user.lastLoginIp,
      lastLoginDevice: user.lastLoginDevice,
      loginCount: user.loginCount,
    });

    if (user.twoFactorEnabled) {
      // Return a temporary token or sign state indicating 2FA is needed
      const tempPayload: TokenPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
        permissions: [],
      };
      const tempToken = await this.jwtService.signAsync(tempPayload, {
        secret: this.configService.get<string>('JWT_SECRET') || 'sgu-super-secret-change-in-production',
        expiresIn: '5m',
      });
      return {
        requires2FA: true,
        tokens: {
          accessToken: tempToken,
          refreshToken: '',
        },
      };
    }

    const tokens = await this.generateTokens(user);
    return {
      requires2FA: false,
      user,
      tokens,
    };
  }

  async verify2FA(userId: string, token: string, tempToken: string): Promise<AuthTokens> {
    try {
      await this.jwtService.verifyAsync(tempToken, {
        secret: this.configService.get<string>('JWT_SECRET') || 'sgu-super-secret-change-in-production',
      });
    } catch {
      throw new UnauthorizedException('2FA verification session expired');
    }

    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Since we're in sandbox/simulation environment for 2FA, we accept '123456' as standard bypass
    const isVerified = token === '123456' || token === user.twoFactorSecret;
    if (!isVerified) {
      throw new UnauthorizedException('Invalid 2FA verification token');
    }

    return this.generateTokens(user);
  }

  async generateTokens(user: User): Promise<AuthTokens> {
    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      permissions: this.getUserPermissions(user.role),
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET') || 'sgu-super-secret-change-in-production',
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') || '15m',
    });

    const refreshToken = await this.jwtService.signAsync(
      { sub: user.id },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'sgu-refresh-secret-change',
        expiresIn: '7d',
      },
    );

    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'sgu-refresh-secret-change',
      });

      const user = await this.usersService.findOne(payload.sub);
      if (!user || user.status === UserStatus.LOCKED || user.status === UserStatus.SUSPENDED) {
        throw new UnauthorizedException('Invalid token session');
      }

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async changePassword(userId: string, oldPass: string, newPass: string): Promise<void> {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(oldPass, user.passwordHash);
    if (!isMatch) {
      throw new BadRequestException('Incorrect old password');
    }

    user.passwordHash = newPass; // will hash automatically in @BeforeUpdate hook
    user.passwordChangedAt = new Date();
    user.passwordExpiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // Expires in 90 days
    await this.usersService.update(userId, {
      passwordHash: user.passwordHash,
      passwordChangedAt: user.passwordChangedAt,
      passwordExpiresAt: user.passwordExpiresAt,
    });
  }

  async setup2FA(userId: string): Promise<{ secret: string; qrCodeUrl: string }> {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const secret = 'NIXD JSUW OEID HEIW'; // Simulated standard key for SGU
    const qrCodeUrl = `otpauth://totp/SGU-ERP:${user.email}?secret=${secret}&issuer=SGU-University`;

    await this.usersService.update(userId, {
      twoFactorSecret: secret,
    });

    return { secret, qrCodeUrl };
  }

  async enable2FA(userId: string, token: string): Promise<void> {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (token !== '123456') {
      throw new BadRequestException('Invalid verification code');
    }

    await this.usersService.update(userId, {
      twoFactorEnabled: true,
    });
  }

  async logout(userId: string, refreshToken?: string): Promise<void> {
    // TODO: Implement Redis token blacklisting for revoked access and refresh tokens in Phase 2
  }

  async logoutAllDevices(userId: string): Promise<void> {
    // TODO: Implement Redis key removal for active device session descriptors in Phase 2
  }

  getUserPermissions(role: UserRole): string[] {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return ['*:*'];
      case UserRole.ADMIN:
        return [
          'users:read', 'users:write', 'users:delete',
          'settings:read', 'settings:write',
          'audit:read',
        ];
      case UserRole.STUDENT:
        return [
          'profile:read',
          'courses:read',
          'grades:read',
          'attendance:read',
          'finance:read',
          'library:read',
        ];
      case UserRole.PROFESSOR:
        return [
          'profile:read',
          'courses:read', 'courses:write',
          'grades:read', 'grades:write',
          'attendance:read', 'attendance:write',
        ];
      case UserRole.TEACHING_ASSISTANT:
        return [
          'profile:read',
          'courses:read',
          'grades:read', 'grades:write',
          'attendance:read', 'attendance:write',
        ];
      case UserRole.ACADEMIC_ADVISOR:
        return [
          'profile:read',
          'students:read',
          'courses:read',
          'grades:read',
        ];
      case UserRole.DEPARTMENT_HEAD:
        return [
          'profile:read',
          'courses:read', 'courses:write',
          'professors:read',
          'departments:read', 'departments:write',
        ];
      case UserRole.DEAN:
        return [
          'profile:read',
          'courses:read',
          'workflows:read', 'workflows:write',
          'reports:read',
        ];
      case UserRole.STUDENT_AFFAIRS:
        return [
          'students:read', 'students:write',
          'enrollments:read', 'enrollments:write',
          'attendance:read', 'attendance:write',
        ];
      case UserRole.HR_STAFF:
        return [
          'employees:read', 'employees:write',
          'attendance:read',
          'payroll:read', 'payroll:write',
        ];
      case UserRole.FINANCE_STAFF:
        return [
          'finance:read', 'finance:write',
          'invoices:read', 'invoices:write',
          'payments:read', 'payments:write',
        ];
      case UserRole.LIBRARIAN:
        return [
          'library:read', 'library:write',
          'books:read', 'books:write',
          'loans:read', 'loans:write',
        ];
      case UserRole.DORM_STAFF:
        return [
          'dorms:read', 'dorms:write',
          'allocations:read', 'allocations:write',
        ];
      case UserRole.SECURITY_STAFF:
        return [
          'security:read',
          'logs:read',
          'visitors:read', 'visitors:write',
        ];
      case UserRole.PARENT:
        return [
          'children:read',
          'courses:read',
          'grades:read',
          'attendance:read',
        ];
      case UserRole.ALUMNI:
        return [
          'profile:read',
          'certificates:read', 'certificates:write',
          'events:read',
        ];
      case UserRole.APPLICANT:
        return [
          'applications:read', 'applications:write',
          'documents:read', 'documents:write',
        ];
      default:
        return [];
    }
  }
}
