import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permissions.entity';
import { CreatePermissionDto } from './dto/create-permission-dto';
import { UpdatePermissionDto } from './dto/update-permission-dto';
import { Active_Permissions } from './entities/active_permissions_view';

@Injectable()
export class PermissionService {
    constructor(
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>,

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

}
