import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/roles.decorator';
import { UserRole } from './user.entity';

@ApiTags('Users')
@Controller({ path: 'users', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STUDENT_AFFAIRS, UserRole.HR_STAFF)
  @ApiOperation({ summary: 'Get all users' })
  async findAll() {
    const users = await this.usersService.findAll();
    return {
      success: true,
      data: users,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return {
      success: true,
      data: user,
    };
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create new user' })
  async create(@Body() createUserDto: any) {
    const user = await this.usersService.create(createUserDto);
    return {
      success: true,
      data: user,
    };
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update user' })
  async update(@Param('id') id: string, @Body() updateUserDto: any) {
    const user = await this.usersService.update(id, updateUserDto);
    return {
      success: true,
      data: user,
    };
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete user' })
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
    return {
      success: true,
      message: 'User removed successfully',
    };
  }
}
