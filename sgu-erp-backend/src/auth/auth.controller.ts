import { Controller, Post, Get, Body, UseGuards, HttpCode, HttpStatus, Ip, Headers, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService, AuthTokens } from './auth.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/roles.decorator';
import { UserRole } from '../users/user.entity';
import { CurrentUser } from '../common/current-user.decorator';

class LoginDto {
  email: string;
  password: string;
}

class Verify2FADto {
  userId: string;
  token: string;
  tempToken: string;
}

class RefreshTokenDto {
  refreshToken: string;
}

class ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

@ApiTags('Authentication')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Throttle({ auth: { ttl: 60000, limit: 5 } })
  @ApiOperation({ summary: 'User login with email and password' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 403, description: 'Account locked or inactive' })
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Ip() ipAddress: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const result = await this.authService.login(
      loginDto.email,
      loginDto.password,
      ipAddress,
      userAgent,
    );

    if (result.requires2FA) {
      return {
        success: true,
        requires2FA: true,
        tempToken: result.tokens.accessToken,
        message: 'Two-factor authentication required',
      };
    }

    return {
      success: true,
      user: {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        role: result.user.role,
        permissions: result.user.permissions,
      },
      tokens: result.tokens,
    };
  }

  @Post('2fa/verify')
  @ApiOperation({ summary: 'Verify 2FA token' })
  @ApiResponse({ status: 200, description: '2FA verification successful' })
  @HttpCode(HttpStatus.OK)
  async verify2FA(@Body() verifyDto: Verify2FADto) {
    const tokens = await this.authService.verify2FA(
      verifyDto.userId,
      verifyDto.token,
      verifyDto.tempToken,
    );

    return {
      success: true,
      tokens,
    };
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Body() refreshDto: RefreshTokenDto) {
    const tokens = await this.authService.refreshTokens(refreshDto.refreshToken);
    return {
      success: true,
      tokens,
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Logout user' })
  @HttpCode(HttpStatus.OK)
  async logout(
    @CurrentUser() user: any,
    @Body('refreshToken') refreshToken?: string,
  ) {
    await this.authService.logout(user.sub, refreshToken);
    return {
      success: true,
      message: 'Logged out successfully',
    };
  }

  @Post('logout-all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Logout from all devices' })
  @HttpCode(HttpStatus.OK)
  async logoutAllDevices(@CurrentUser() user: any) {
    await this.authService.logoutAllDevices(user.sub);
    return {
      success: true,
      message: 'Logged out from all devices',
    };
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Change password' })
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @CurrentUser() user: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.authService.changePassword(
      user.sub,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword,
    );
    return {
      success: true,
      message: 'Password changed successfully',
    };
  }

  @Post('2fa/setup')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Setup 2FA' })
  @HttpCode(HttpStatus.OK)
  async setup2FA(@CurrentUser() user: any) {
    const result = await this.authService.setup2FA(user.sub);
    return {
      success: true,
      secret: result.secret,
      qrCodeUrl: result.qrCodeUrl,
    };
  }

  @Post('2fa/enable')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Enable 2FA' })
  @HttpCode(HttpStatus.OK)
  async enable2FA(
    @CurrentUser() user: any,
    @Body('token') token: string,
  ) {
    await this.authService.enable2FA(user.sub, token);
    return {
      success: true,
      message: 'Two-factor authentication enabled',
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user info' })
  async getCurrentUser(@CurrentUser() user: any) {
    return {
      success: true,
      user: {
        id: user.sub,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
      },
    };
  }
}
