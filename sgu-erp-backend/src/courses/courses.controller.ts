import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/roles.decorator';
import { UserRole } from '../users/user.entity';

@ApiTags('Courses')
@Controller({ path: 'courses', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all courses' })
  async findAll() {
    const courses = await this.coursesService.findAll();
    return {
      success: true,
      data: courses,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get course by ID' })
  async findOne(@Param('id') id: string) {
    const course = await this.coursesService.findOne(id);
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return {
      success: true,
      data: course,
    };
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DEAN, UserRole.DEPARTMENT_HEAD)
  @ApiOperation({ summary: 'Create course' })
  async create(@Body() createDto: any) {
    const course = await this.coursesService.create(createDto);
    return {
      success: true,
      data: course,
    };
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DEAN, UserRole.DEPARTMENT_HEAD)
  @ApiOperation({ summary: 'Update course' })
  async update(@Param('id') id: string, @Body() updateDto: any) {
    const course = await this.coursesService.update(id, updateDto);
    return {
      success: true,
      data: course,
    };
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete course' })
  async remove(@Param('id') id: string) {
    await this.coursesService.remove(id);
    return {
      success: true,
      message: 'Course removed successfully',
    };
  }
}
