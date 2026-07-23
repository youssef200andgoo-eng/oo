import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GradesService } from './grades.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/roles.decorator';
import { UserRole } from '../users/user.entity';

@ApiTags('Grades')
@Controller({ path: 'grades', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PROFESSOR, UserRole.STUDENT_AFFAIRS)
  @ApiOperation({ summary: 'Get all grades' })
  async findAll() {
    const grades = await this.gradesService.findAll();
    return {
      success: true,
      data: grades,
    };
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get grades by student ID' })
  async findByStudent(@Param('studentId') studentId: string) {
    const grades = await this.gradesService.findByStudent(studentId);
    return {
      success: true,
      data: grades,
    };
  }

  @Get('course/:courseId')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PROFESSOR)
  @ApiOperation({ summary: 'Get grades by course ID' })
  async findByCourse(@Param('courseId') courseId: string) {
    const grades = await this.gradesService.findByCourse(courseId);
    return {
      success: true,
      data: grades,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get grade by ID' })
  async findOne(@Param('id') id: string) {
    const grade = await this.gradesService.findOne(id);
    if (!grade) {
      throw new NotFoundException(`Grade with ID ${id} not found`);
    }
    return {
      success: true,
      data: grade,
    };
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PROFESSOR, UserRole.TEACHING_ASSISTANT)
  @ApiOperation({ summary: 'Create grade record' })
  async create(@Body() createDto: any) {
    const grade = await this.gradesService.create(createDto);
    return {
      success: true,
      data: grade,
    };
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PROFESSOR)
  @ApiOperation({ summary: 'Update grade record' })
  async update(@Param('id') id: string, @Body() updateDto: any) {
    const grade = await this.gradesService.update(id, updateDto);
    return {
      success: true,
      data: grade,
    };
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete grade record' })
  async remove(@Param('id') id: string) {
    await this.gradesService.remove(id);
    return {
      success: true,
      message: 'Grade record removed successfully',
    };
  }
}
