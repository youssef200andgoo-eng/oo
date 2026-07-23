import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/roles.decorator';
import { UserRole } from '../users/user.entity';

@ApiTags('Students')
@Controller({ path: 'students', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PROFESSOR, UserRole.STUDENT_AFFAIRS, UserRole.ACADEMIC_ADVISOR)
  @ApiOperation({ summary: 'Get all students' })
  async findAll() {
    const students = await this.studentsService.findAll();
    return {
      success: true,
      data: students,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get student by ID' })
  async findOne(@Param('id') id: string) {
    const student = await this.studentsService.findOne(id);
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return {
      success: true,
      data: student,
    };
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STUDENT_AFFAIRS)
  @ApiOperation({ summary: 'Create student record' })
  async create(@Body() createDto: any) {
    const student = await this.studentsService.create(createDto);
    return {
      success: true,
      data: student,
    };
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STUDENT_AFFAIRS)
  @ApiOperation({ summary: 'Update student record' })
  async update(@Param('id') id: string, @Body() updateDto: any) {
    const student = await this.studentsService.update(id, updateDto);
    return {
      success: true,
      data: student,
    };
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete student record' })
  async remove(@Param('id') id: string) {
    await this.studentsService.remove(id);
    return {
      success: true,
      message: 'Student record removed successfully',
    };
  }
}
