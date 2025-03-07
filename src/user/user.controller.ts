import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query, NotFoundException, Req } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { User } from './entities/user.entity';
import { AdminUserView } from './entities/admin_user_view';
import { NonAdminUserView } from './entities/non_admin_users_view';
import { ActiveUsers_View } from './entities/view_active_users';
import { PermissionsGuard } from 'src/permissions/permissions.guard';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('add')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @SetMetadata('permissions', ['crear usuarios'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid data.' })
  @ApiBody({ description: 'Data to create a new user', type: CreateUserDto })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string, @Req() req) {
    const host = req.get('origin') || req.get('host');
    return this.userService.requestPasswordReset(email, host);
  }

  @Post('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string
  ) {
    return this.userService.resetPassword(token, newPassword);
  }

  @Put('edit/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @SetMetadata('permissions', ['editar usuarios'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiResponse({ status: 200, description: 'User successfully updated.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiBody({
    description: 'Request body to update a user',
    type: UpdateUserDto,
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @SetMetadata('permissions', ['eliminar usuarios'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({ status: 200, description: 'User successfully deleted.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiParam({ name: 'id', description: 'User ID' })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Put('activate/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @SetMetadata('permissions', ['actualizar estado'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user active status' })
  @ApiResponse({ status: 200, description: 'User status updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        is_active: {
          type: 'boolean',
          example: true,
        },
      },
    },
  })
  async updateStatus(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.userService.updateStatus(id, updateUserDto);
  }

  @Get('/getadmin')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @SetMetadata('permissions', ['administrador'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all admin users' })
  @ApiResponse({
    status: 200,
    description: 'The admin users have been successfully retrieved.',
    type: [AdminUserView],
  })
  @ApiResponse({
    status: 404,
    description: 'No admin users found.',
  })
  async findAllAdminUser(): Promise<AdminUserView[]> {
    try {
      return await this.userService.findOnlyAdmin();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('No admin users found');
      }
      throw error;
    }
  }

  @Get('/getnonadmin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all non admin users' })
  @ApiResponse({
    status: 200,
    description: 'The non admin users have been successfully retrieved.',
    type: [NonAdminUserView],
  })
  @ApiResponse({
    status: 404,
    description: 'No users found.',
  })
  async findAllNonAdminUser(): Promise<NonAdminUserView[]> {
    try {
      return await this.userService.findOnlyNonAdmin();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('No users found');
      }
      throw error;
    }
  }

  @Get('/get')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @SetMetadata('permissions', ['visualizar tablas'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all active users' })
  @ApiResponse({ status: 200, description: 'List of active users', type: [ActiveUsers_View] })
  @ApiQuery({ name: 'startCreatedAt', required: false, type: String, description: 'Start date for created_at filter' })
  @ApiQuery({ name: 'endCreatedAt', required: false, type: String, description: 'End date for created_at filter' })
  @ApiQuery({ name: 'exactCreatedAt', required: false, type: String, description: 'Exact date for created_at filter' })
  @ApiQuery({ name: 'startUpdatedAt', required: false, type: String, description: 'Start date for updated_at filter' })
  @ApiQuery({ name: 'endUpdatedAt', required: false, type: String, description: 'End date for updated_at filter' })
  @ApiQuery({ name: 'exactUpdatedAt', required: false, type: String, description: 'Exact date for updated_at filter' })
  @ApiQuery({ name: 'name', required: false, type: String, description: 'Filter by user name' })
  @ApiQuery({ name: 'role', required: false, type: String, description: 'Filter by role name' })
  @ApiQuery({ name: 'email', required: false, type: String, description: 'Filter by email' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Filter by active status' })
  async findAll(
    @Query('startCreatedAt') startCreatedAt?: string,
    @Query('endCreatedAt') endCreatedAt?: string,
    @Query('exactCreatedAt') exactCreatedAt?: string,
    @Query('startUpdatedAt') startUpdatedAt?: string,
    @Query('endUpdatedAt') endUpdatedAt?: string,
    @Query('exactUpdatedAt') exactUpdatedAt?: string,
    @Query('name') name?: string,
    @Query('role') role?: string,
    @Query('email') email?: string,
    @Query('isActive') isActive?: boolean
  ): Promise<ActiveUsers_View[]> {
    return this.userService.findAll(
      startCreatedAt,
      endCreatedAt,
      exactCreatedAt,
      startUpdatedAt,
      endUpdatedAt,
      exactUpdatedAt,
      name,
      role,
      email,
      isActive
    );
  }
  
  

  @Get('get/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @SetMetadata('permissions', ['visualizar tablas'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, description: 'User found.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiParam({ name: 'id', description: 'User ID' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }
}
