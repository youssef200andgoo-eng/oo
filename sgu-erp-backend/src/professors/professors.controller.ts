import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProfessorsService } from './professors.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/roles.decorator';
import { UserRole } from '../users/user.entity';

@ApiTags('Professors')
@Controller({ path: 'professors', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class ProfessorsController {
  constructor(private readonly professorsService: ProfessorsService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DEAN, UserRole.DEPARTMENT_HEAD, UserRole.HR_STAFF)
  @ApiOperation({ summary: 'Get all professors' })
  async findAll() {
    const professors = await this.professorsService.findAll();
    return {
      success: true,
      data: professors,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get professor by ID' })
  async findOne(@Param('id') id: string) {
    const professor = await this.professorsService.findOne(id);
    if (!professor) {
      throw new NotFoundException(`Professor with ID ${id} not found`);
    }
    return {
      success: true,
      data: professor,
    };
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR_STAFF)
  @ApiOperation({ summary: 'Create professor record' })
  async create(@Body() createDto: any) {
    const professor = await this.professorsService.create(createDto);
    return {
      success: true,
      data: professor,
    };
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR_STAFF)
  @ApiOperation({ summary: 'Update professor record' })
  async update(@Param('id') id: string, @Body() updateDto: any) {
    const professor = await this.professorsService.update(id, updateDto);
    return {
      success: true,
      data: professor,
    };
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete professor record' })
  async remove(@Param('id') id: string) {
    await this.professorsService.remove(id);
    return {
      success: true,
      message: 'Professor record removed successfully',
    };
  }
}
