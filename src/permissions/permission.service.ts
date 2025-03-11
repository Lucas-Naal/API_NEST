import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Permission } from './entities/permissions.entity';
import { CreatePermissionDto } from './dto/create-permission-dto';
import { UpdatePermissionDto } from './dto/update-permission-dto';
import { Active_Permissions } from './entities/active_permissions_view';
import { Role } from 'src/roles/entities/roles.entity';
import { ActionType } from 'src/log/dto/action-type.enum';
import { LogService } from 'src/log/log.service';
import { ModulesService } from 'src/modules/modules.service';

@Injectable()
export class PermissionService {
    constructor(
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>,

        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,

        @InjectRepository(Active_Permissions)
        private readonly active_permissionRepository: Repository<Active_Permissions>,

                private readonly logService: LogService,

        private readonly moduleRepository: ModulesService
    ) { }

    //INICIO DE CREAR UN PERMISO
    async create(createPermissionDto: CreatePermissionDto, usuario_id: number): Promise<Permission> {
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

        const createdPermission = await this.permissionRepository.save(permission);

        await this.logService.createPermissionLog(
            usuario_id,
            ActionType.AGREGACION,
            createdPermission,
            null,
        );

        return createdPermission;
    }
    //FIN DE CREAR UN PERMISO

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
    //INICIO DE ACTUALIZAR UN PERMISO
    async update(id: number, updatePermissionDto: UpdatePermissionDto, usuario_id: number): Promise<Permission> {
        const permission = await this.permissionRepository.findOne({ where: { id } });
    
        if (!permission) {
            throw new BadRequestException('Permission not found');
        }
    
        if (permission.deleted_at) {
            throw new BadRequestException('Cannot edit a deleted permission');
        }
    
        if (updatePermissionDto.name) {
            const existingPermission = await this.permissionRepository.findOne({
                where: { name: updatePermissionDto.name },
            });
    
            if (existingPermission && existingPermission.id !== id) {
                throw new BadRequestException('A permission with this name already exists');
            }
        }
    
        const originalPermission = { ...permission };
    
        if (updatePermissionDto.is_active !== undefined) {
            permission.is_active = updatePermissionDto.is_active;
        }
        permission.name = updatePermissionDto.name;
        permission.updated_at = new Date();
    
        const updatedPermission = await this.permissionRepository.save(permission);
    
        await this.logService.createPermissionLog(
            usuario_id,
            ActionType.MODIFICACION,  
            originalPermission ,  
            updatedPermission    
        );
    
        return updatedPermission;
    }
    
    //FIN DE ACTUALIZAR UN PERMISO

    //INICIO DE ACTUALIZAR ESTADO DE UN PERMISO
    async updateStatus(id: number, updatePermissionDto: { is_active: boolean }, userId: number): Promise<Permission> {
        const permission = await this.permissionRepository.findOne({ where: { id } });
    
        if (!permission) {
            throw new NotFoundException('Permission not found');
        }
    
        if (permission.deleted_at) {
            throw new BadRequestException('Cannot activate/deactivate a deleted permission');
        }
    
        const originalPermission = { ...permission };
    
        permission.is_active = updatePermissionDto.is_active;
        permission.updated_at = new Date();
    
        const actionType = updatePermissionDto.is_active ? ActionType.ACTIVACION : ActionType.DESACTIVACION;
    
        await this.logService.createPermissionLog(
            userId,
            actionType,
            [originalPermission],
            { ...permission, is_active: updatePermissionDto.is_active }
        );
    
        const updatedPermission = await this.permissionRepository.save(permission);
    
        return updatedPermission;
    }
    
    //FIN DE ACTUALIZAR ESTADO DE UN PERMISO

    //INICIO DE ELIMINAR UN PERMISO
    async remove(id: number): Promise<Permission> {
        const permission = await this.findOne(id);

        if (permission.deleted_at) {
            throw new BadRequestException('Permission has already been deleted');
        }

        permission.deleted_at = new Date();

        const deletedpermission = await this.permissionRepository.save(permission);

        return deletedpermission;
    }
    //FIN DE ELIMINAR UN PERMISO

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
