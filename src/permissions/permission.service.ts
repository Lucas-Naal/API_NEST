import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Permission } from './entities/permissions.entity';
import { CreatePermissionDto } from './dto/create-permission-dto';
import { UpdatePermissionDto } from './dto/update-permission-dto';
import { Active_Permissions } from './entities/active_permissions_view';
import { Role } from 'src/roles/entities/roles.entity';

@Injectable()
export class PermissionService {
    constructor(
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>,

        @InjectRepository(Role)
        private readonly roleRepository : Repository<Role>,

        @InjectRepository(Active_Permissions)
        private readonly active_permissionRepository: Repository<Active_Permissions>
    ) { }

    async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
        const existingPermission = await this.permissionRepository.findOne({
            where: { name: createPermissionDto.name },
        });

        if (existingPermission) {

            throw new ConflictException('Permission with this name already exists');
        }

        const permission = this.permissionRepository.create({
            ...createPermissionDto,
            is_active: createPermissionDto.is_active !== undefined ? createPermissionDto.is_active : false,
        });

        return await this.permissionRepository.save(permission);
    }

    async findAll(): Promise<Permission[]> {
        return await this.permissionRepository.find();
    }

    async findOnlyActivePermissions(): Promise<Active_Permissions[]> {
        const nonadmin = await this.active_permissionRepository.find();

        if (nonadmin.length === 0) {
            throw new NotFoundException('No admin users found');
        }

        return nonadmin;
    }

    async findOne(id: number): Promise<Permission> {
        const permission = await this.permissionRepository.findOne({ where: { id } });
        if (!permission) {
            throw new NotFoundException(`Permission with ID ${id} not found.`);
        }
        return permission;
    }

    async update(id: number, updatePermissionDto: UpdatePermissionDto): Promise<Permission> {
        const permission = await this.findOne(id);
    
        if (permission.deleted_at) {
            throw new BadRequestException('Cannot edit a deleted permission');
        }
    
        if (updatePermissionDto.name) {
            const existingPermission = await this.permissionRepository.findOne({ where: { name: updatePermissionDto.name } });
    
            if (existingPermission && existingPermission.id !== id) {
                throw new BadRequestException('A permission with this name already exists');
            }
        }
    
        if (updatePermissionDto.is_active !== undefined) {
            permission.is_active = updatePermissionDto.is_active;
        }
    
        permission.name = updatePermissionDto.name;
        permission.updated_at = new Date();
    
        return await this.permissionRepository.save(permission);
    }
    


    async activate(id: number): Promise<Permission> {
        const permission = await this.findOne(id);

        if (permission.deleted_at) {
            throw new BadRequestException('Cannot activate/deactivate a deleted permission');
        }

        permission.is_active = !permission.is_active;
        permission.updated_at = new Date();

        const updatedPermission = await this.permissionRepository.save({
            id: permission.id,
            is_active: permission.is_active,
            updated_at: permission.updated_at,
        });

        return updatedPermission;
    }


    async remove(id: number): Promise<Permission> {
        const permission = await this.findOne(id);

        if (permission.deleted_at) {
            throw new BadRequestException('Permission has already been deleted');
        }

        permission.deleted_at = new Date();

        const deletedpermission = await this.permissionRepository.save(permission);

        return deletedpermission;
    }

    async assignPermissionsToRole(roleId: number, permissionIds: number[]): Promise<Role> {
        const role = await this.roleRepository.findOne({
            where: { id: roleId },
            relations: ['permissions'],  
        });
        if (!role) {
            throw new NotFoundException(`Role with ID ${roleId} not found.`);
        }

        const permissions = await this.permissionRepository.find({
            where: { id: In(permissionIds) },  
        });
        
        if (permissions.length !== permissionIds.length) {
            throw new NotFoundException('Some permissions not found.');
        }
        
        role.permissions = permissions;

        return await this.roleRepository.save(role);
    }

}
