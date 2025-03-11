import { Controller, Post, Body, Get, Param, Delete, Put, UseGuards, Request } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { CreatePermissionDto } from './dto/create-permission-dto';
import { UpdatePermissionDto } from './dto/update-permission-dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { Permission } from './entities/permissions.entity';
import { AddPermissionsToRoleDto } from './dto/add-permissions-to-role.dto';

@ApiTags('Permissions')
@Controller('permissions')
export class PermissionController {
    constructor(private readonly permissionService: PermissionService) { }

    @Post('add')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new permission' })
    @ApiResponse({ status: 201, description: 'The permission has been successfully created.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    async create(
        @Body() createPermissionDto: CreatePermissionDto, 
        @Request() req 
    ) {
        return this.permissionService.create(createPermissionDto, req.user.sub); 
    }


    @Post('add/permissionstorole')
    @UseGuards(JwtAuthGuard) 
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Assign permissions to a role' })  
    @ApiResponse({ status: 201, description: 'Permissions successfully assigned to the role.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    @ApiResponse({ status: 404, description: 'Role or permissions not found.' })
    async addPermissionsToRole(
        @Body() addPermissionsToRoleDto: AddPermissionsToRoleDto 
    ) {
        const { roleId, permissionIds } = addPermissionsToRoleDto;
        return this.permissionService.assignPermissionsToRole(roleId, permissionIds);
    }

    @Put('edit/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update an existing permission' })
    @ApiResponse({ status: 200, description: 'The permission has been successfully updated.' })
    @ApiResponse({ status: 404, description: 'Permission not found.' })
    async update(
        @Param('id') id: number,
        @Body() updatePermissionDto: UpdatePermissionDto,
        @Request() req,  
    ) {
        return this.permissionService.update(id, updatePermissionDto, req.user.sub); 
    }

    @Delete('delete/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Soft delete a permission by setting deleted_at' })
    @ApiResponse({ 
        status: 200, 
        description: 'The permission has been successfully marked as deleted.',
        schema: {
            example: {
                id: 1,
                name: 'Write Access',
                deleted_at: '2025-02-11T12:34:56Z',
            },
        },
    })
    @ApiResponse({ status: 400, description: 'Permission has already been deleted.' })
    @ApiResponse({ status: 404, description: 'Permission not found.' })
    async remove(@Param('id') id: number): Promise<Permission> {
        return await this.permissionService.remove(id); 
    }

    @Put('activate/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Activate or deactivate a permission (toggle the is_active field)' })
    @ApiResponse({
        status: 200,
        description: 'The permission has been successfully updated.',
        schema: {
            example: {
                is_active: true,
            },
        },
    })
    @ApiResponse({ status: 400, description: 'Cannot activate/deactivate a deleted permission.' })
    @ApiResponse({ status: 404, description: 'Permission not found.' })
    @ApiBody({
        description: 'Body to set the permission status as active or inactive',
        type: Object,
        examples: {
            example1: {
                value: { is_active: true },
            },
            example2: {
                value: { is_active: false },
            },
        },
    })
    async updateStatus(
        @Param('id') id: number,
        @Body() updatePermissionDto: { is_active: boolean },
        @Request() request: any,
    ): Promise<Permission> {
        const userId = request.user.sub; 
    
        if (!userId) {
            throw new Error('User ID is required for logging.');
        }
    
        return this.permissionService.updateStatus(id, updatePermissionDto, userId);
    }
    
    @Get('get')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all permissions' })
    @ApiResponse({ status: 200, description: 'List of all permissions.' })
    async findAll() {
        return this.permissionService.findAll();
    }

    @Get('get/onlyactive')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all permissions' })
    @ApiResponse({ status: 200, description: 'List of all permissions.' })
    async findAllActivePermissions() {
        return this.permissionService.findOnlyActivePermissions();
    }

    @Get('get/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get a permission by ID' })
    @ApiResponse({ status: 200, description: 'The permission has been successfully fetched.' })
    @ApiResponse({ status: 404, description: 'Permission not found.' })
    async findOne(@Param('id') id: number) {
        return this.permissionService.findOne(id);
    }


}
