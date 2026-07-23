import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/roles.decorator';
import { UserRole } from '../users/user.entity';

@ApiTags('Attendance')
@Controller({ path: 'attendance', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PROFESSOR, UserRole.STUDENT_AFFAIRS)
  @ApiOperation({ summary: 'Get all attendance records' })
  async findAll() {
    const records = await this.attendanceService.findAll();
    return {
      success: true,
      data: records,
    };
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get attendance records for a student' })
  async findByStudent(@Param('studentId') studentId: string) {
    const records = await this.attendanceService.findByStudent(studentId);
    return {
      success: true,
      data: records,
    };
  }

  @Get('course/:courseId')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PROFESSOR)
  @ApiOperation({ summary: 'Get attendance records for a course' })
  async findByCourse(@Param('courseId') courseId: string) {
    const records = await this.attendanceService.findByCourse(courseId);
    return {
      success: true,
      data: records,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get attendance record by ID' })
  async findOne(@Param('id') id: string) {
    const record = await this.attendanceService.findOne(id);
    if (!record) {
      throw new NotFoundException(`Attendance record with ID ${id} not found`);
    }
    return {
      success: true,
      data: record,
    };
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PROFESSOR, UserRole.TEACHING_ASSISTANT)
  @ApiOperation({ summary: 'Create attendance record' })
  async create(@Body() createDto: any) {
    const record = await this.attendanceService.create(createDto);
    return {
      success: true,
      data: record,
    };
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PROFESSOR)
  @ApiOperation({ summary: 'Update attendance record' })
  async update(@Param('id') id: string, @Body() updateDto: any) {
    const record = await this.attendanceService.update(id, updateDto);
    return {
      success: true,
      data: record,
    };
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete attendance record' })
  async remove(@Param('id') id: string) {
    await this.attendanceService.remove(id);
    return {
      success: true,
      message: 'Attendance record removed successfully',
    };
  }
}
