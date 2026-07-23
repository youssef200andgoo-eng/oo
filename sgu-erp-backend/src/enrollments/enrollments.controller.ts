import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { EnrollmentsService } from './enrollments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/roles.decorator';
import { UserRole } from '../users/user.entity';

@ApiTags('Enrollments')
@Controller({ path: 'enrollments', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PROFESSOR, UserRole.STUDENT_AFFAIRS)
  @ApiOperation({ summary: 'Get all enrollments' })
  async findAll() {
    const enrollments = await this.enrollmentsService.findAll();
    return {
      success: true,
      data: enrollments,
    };
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get enrollments by student ID' })
  async findByStudent(@Param('studentId') studentId: string) {
    const enrollments = await this.enrollmentsService.findByStudent(studentId);
    return {
      success: true,
      data: enrollments,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get enrollment by ID' })
  async findOne(@Param('id') id: string) {
    const enrollment = await this.enrollmentsService.findOne(id);
    if (!enrollment) {
      throw new NotFoundException(`Enrollment with ID ${id} not found`);
    }
    return {
      success: true,
      data: enrollment,
    };
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STUDENT_AFFAIRS, UserRole.STUDENT)
  @ApiOperation({ summary: 'Create enrollment' })
  async create(@Body() createDto: any) {
    const enrollment = await this.enrollmentsService.create(createDto);
    return {
      success: true,
      data: enrollment,
    };
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STUDENT_AFFAIRS)
  @ApiOperation({ summary: 'Update enrollment' })
  async update(@Param('id') id: string, @Body() updateDto: any) {
    const enrollment = await this.enrollmentsService.update(id, updateDto);
    return {
      success: true,
      data: enrollment,
    };
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STUDENT_AFFAIRS)
  @ApiOperation({ summary: 'Delete enrollment' })
  async remove(@Param('id') id: string) {
    await this.enrollmentsService.remove(id);
    return {
      success: true,
      message: 'Enrollment removed successfully',
    };
  }
}
