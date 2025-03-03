import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, NotFoundException } from '@nestjs/common';
import { RoleService } from './roles.service';
import { Role } from './entities/roles.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateRoleDto } from './dto/create-role-dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesWithPermissionsView } from './entities/roles_with_permissions_view';

@ApiTags('Roles')
@Controller('roles')
export class RoleController {
    constructor(private readonly roleService: RoleService) { }

    @Post('add')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new role' })
    @ApiResponse({ status: 201, description: 'Role successfully created.' })
    @ApiResponse({ status: 400, description: 'Invalid data or role already exists.' })
    @ApiBody({
        description: 'Required data to create a role',
        type: CreateRoleDto,
    })
    async create(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
        const { name, permissions, is_active } = createRoleDto;

        return this.roleService.createRole(name, permissions, is_active ?? true);
    }
    @Put('edit/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Edit an existing role' })
    @ApiResponse({ status: 200, description: 'Role successfully updated.' })
    @ApiResponse({ status: 400, description: 'Invalid data.' })
    @ApiResponse({ status: 404, description: 'Role not found.' })
    @ApiBody({
        description: 'Updated data for the role',
        type: UpdateRoleDto,
        examples: {
            example1: {
                value: {
                    name: 'Editor',
                    is_active: true,
                    permissions: [1, 2, 3]
                }
            }
        }
    })
    async update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto): Promise<Role> {
        return this.roleService.updateRole(id, updateRoleDto);
    }


    @Delete('delete/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a role' })
    @ApiResponse({ status: 200, description: 'Role successfully deleted.' })
    @ApiResponse({ status: 404, description: 'Role not found.' })
    async delete(@Param('id') id: number): Promise<{ message: string }> {
        return this.roleService.deleteRole(id);
    }
    

    @Put('activate/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Activate or deactivate a role' })
    @ApiResponse({ status: 200, description: 'Role status updated successfully.' })
    @ApiResponse({ status: 404, description: 'Role not found.' })
    @ApiBody({
        description: 'Body to set the role status as active or inactive',
        type: Object,
        examples: {
            example1: {
                value: { is_active: true }
            },
            example2: {
                value: { is_active: false }
            }
        }
    })
    async updateStatus(@Param('id') id: number, @Body() updateRoleDto: { is_active: boolean }): Promise<{ message: string; roles: { id: number; is_active: boolean }[] }> {
        return this.roleService.updateStatus(id, updateRoleDto);
    }
    



    @Get('get')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all roles' })
    @ApiResponse({ status: 200, description: 'List of roles successfully retrieved.', type: [Role] })
    @ApiResponse({ status: 401, description: 'Unauthorized access.' })
    async findAll(): Promise<Role[]> {
        return this.roleService.getAllRoles();
    }

    @Get('/permissions-by-role/:roleId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get permissions assigned to a specific role' })
    @ApiResponse({
        status: 200,
        description: 'The permissions assigned to the role have been successfully retrieved.',
        type: RolesWithPermissionsView,
    })
    @ApiResponse({
        status: 404,
        description: 'No permissions found for the specified role.',
    })
    async findPermissionsByRole(@Param('roleId') roleId: number): Promise<RolesWithPermissionsView[]> {
        try {
            return await this.roleService.findRolesWithPermissionsByRoleId(roleId);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(`No permissions found for role with ID: ${roleId}`);
            }
            throw error;
        }
    }
    
    

    @Get('getbyid/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get permissions for a role' })
    @ApiResponse({ status: 200, description: 'Permissions retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'Role not found.' })
    async getPermissions(@Param('id') id: number) {
        return await this.roleService.getPermissionsByRole(id);
    }
}
