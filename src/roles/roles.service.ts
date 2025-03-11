import { ConflictException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, In, IsNull } from 'typeorm';
import { Role } from './entities/roles.entity';
import { Permission } from 'src/permissions/entities/permissions.entity';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesWithPermissionsView } from './entities/roles_with_permissions_view';
import { ActionType } from 'src/log/dto/action-type.enum';
import { LogService } from 'src/log/log.service';
import { ModulesService } from 'src/modules/modules.service';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,

        @InjectEntityManager()
        private readonly entityManager: EntityManager,

        @InjectRepository(RolesWithPermissionsView)
        private readonly roleswithpermissionRepository: Repository<RolesWithPermissionsView>,

        private readonly logService: LogService,

        private readonly moduleRepository: ModulesService
    ) { }

    //INICIO CREAR ROL
    async createRole(name: string, permissions: number[] = [], is_active: boolean = true, usuario_id: number): Promise<Role> {
        const existingRole = await this.roleRepository.findOne({ where: { name } });

        if (existingRole) {
            throw new ConflictException('A role with that name already exists');
        }

        const newRole = this.roleRepository.create({ name, is_active });

        if (permissions && permissions.length > 0) {
            const allPermissions = await this.entityManager.findBy(Permission, {
                id: In(permissions),
            });

            const deletedPermissions = allPermissions
                .filter(permission => permission.deleted_at !== null)
                .map(permission => permission.name);

            if (deletedPermissions.length > 0) {
                throw new BadRequestException(
                    `The following permissions are deleted and cannot be assigned: ${deletedPermissions.join(', ')}`
                );
            }

            newRole.permissions = allPermissions.filter(permission => permission.is_active);
        }

        const savedRole = await this.roleRepository.save(newRole);

        await this.logService.createLogRol(
            usuario_id,
            ActionType.AGREGACION,
            {
                name: savedRole.name,
                permissions: savedRole.permissions,
                is_active: savedRole.is_active,
            },
            null,
        );

        return savedRole;
    }
    //FIN CREAR ROL

    //INICIO ACTUALIZAR ROL
    async updateRole(
        id: number,
        updateRoleDto: UpdateRoleDto,
        userId: number,
    ): Promise<Role> {
        const role = await this.roleRepository.findOne({ where: { id } });

        if (!role) {
            throw new NotFoundException(`Role with ID ${id} not found`);
        }

        if (role.deleted_at) {
            throw new BadRequestException(`Role with ID ${id} is deleted and cannot be updated`);
        }

        if (updateRoleDto.name) {
            const existingRole = await this.roleRepository.findOne({ where: { name: updateRoleDto.name } });
            if (existingRole && existingRole.id !== id) {
                throw new ConflictException('Name is already taken');
            }
        }

        const previousRole = { ...role };

        role.name = updateRoleDto.name || role.name;
        role.is_active = updateRoleDto.is_active !== undefined ? updateRoleDto.is_active : role.is_active;
        role.updated_at = new Date();

        if (updateRoleDto.permissions && updateRoleDto.permissions.length > 0) {
            const allPermissions = await this.entityManager.findBy(Permission, {
                id: In(updateRoleDto.permissions),
            });

            const inactivePermissions = allPermissions
                .filter(permission => !permission.is_active)
                .map(permission => permission.name);

            if (inactivePermissions.length > 0) {
                throw new BadRequestException(
                    `The following permissions are inactive and cannot be assigned: ${inactivePermissions.join(', ')}`
                );
            }

            role.permissions = allPermissions.filter(permission => permission.is_active);
        }

        const updatedRole = await this.roleRepository.save(role);

        await this.logService.createLogRol(
            userId,
            ActionType.MODIFICACION,
            previousRole,
            {
                name: updatedRole.name,
                permissions: updatedRole.permissions,
                is_active: updatedRole.is_active,
            },
        );

        return updatedRole;
    }

    //FIN ACTUALIZAR ROL

    //INICIO ELIMINAR ROL
    async deleteRole(id: number | number[], userId: number): Promise<{ message: string }> {
        const roleIds = Array.isArray(id) ? id : [id];

        const roles = await this.roleRepository.findByIds(roleIds);

        if (roles.length !== roleIds.length) {
            throw new NotFoundException(`Some roles not found`);
        }

        roles.forEach((role) => {
            if (role.deleted_at) {
                throw new BadRequestException(`Role with ID ${role.id} is already deleted`);
            }

            const previousRole = { ...role };

            role.deleted_at = new Date();
        });

        await this.roleRepository.save(roles);

        await this.logService.createLogRol(
            userId,
            ActionType.ELIMINACION,
            roles,
            null
        );

        return { message: 'Roles deleted successfully' };
    }

    //FIN ELIMINAR ROL


    //INICIO ACTUALIZAR ESTADO ROL
    async updateStatus(ids: number | number[], updateRoleDto: UpdateRoleDto, userId: number): Promise<{ message: string; roles: { id: number; is_active: boolean }[] }> {
        const roleIds = Array.isArray(ids) ? ids : [ids];

        const roles = await this.roleRepository.findBy({ id: In(roleIds) });

        if (roles.length !== roleIds.length) {
            throw new NotFoundException(`Some roles not found`);
        }

        roles.forEach((role) => {
            if (role.deleted_at) {
                throw new BadRequestException(`Role with ID ${role.id} is deleted and cannot be updated`);
            }

            if (updateRoleDto.is_active !== undefined) {
                const originalRole = { ...role };

                const actionType = updateRoleDto.is_active ? ActionType.ACTIVACION : ActionType.DESACTIVACION;

                this.logService.createLogRol(
                    userId,
                    actionType,
                    originalRole,
                    { ...role, is_active: updateRoleDto.is_active }
                );

                role.is_active = updateRoleDto.is_active;
            }
        }); 

        await this.roleRepository.save(roles);

        return {
            message: 'Roles status updated successfully',
            roles: roles.map((role) => ({ id: role.id, is_active: role.is_active })),
        };
    }


    //FIN ACTUALIZAR ESTADO ROL

    //GET ALL
    async getAllRoles(): Promise<Role[]> {
        return this.roleRepository.find({
            relations: ['permissions'],
            where: {
                deleted_at: IsNull(),
                permissions: {
                    deleted_at: IsNull(),
                },
            },
            order: {
                id: 'ASC',
            },
        });
    }


    async findRolesWithPermissionsByRoleId(roleId: number): Promise<any[]> {
        const rolesWithPermissions = await this.roleswithpermissionRepository.find({ where: { role_id: roleId } });

        if (rolesWithPermissions.length === 0) {
            throw new NotFoundException(`No permissions found for role with ID: ${roleId}`);
        }

        const groupedRoles = rolesWithPermissions.reduce<any[]>((acc, role) => {
            const existingRole = acc.find(r => r.role_id === role.role_id);

            if (existingRole) {
                existingRole.permissions.push({
                    permission_id: role.permission_id,
                    permission_name: role.permission_name
                });
            } else {
                acc.push({
                    role_id: role.role_id,
                    role_name: role.role_name,
                    is_active: role.is_active,
                    permissions: [
                        {
                            permission_id: role.permission_id,
                            permission_name: role.permission_name
                        }
                    ]
                });
            }

            return acc;
        }, []);

        return groupedRoles;
    }



    async getRoleById(id: number): Promise<Role> {
        const role = await this.roleRepository.findOne({
            relations: ['permissions'],
        });

        if (!role) {
            throw new NotFoundException(`Role with ID ${id} not found`);
        }

        return role;
    }

    async getPermissionsByRole(id: number): Promise<{ permissions: Permission[] }> {
        const permissions = await this.entityManager.query(
            `SELECT "role_name", "permission_id", "permission_name", "deleted_at", "is_active" 
            FROM "view_permission_by_role" 
            WHERE "role_id" = $1`, [id]
        );

        if (!permissions || permissions.length === 0) {
            throw new NotFoundException(`No permissions found for role with ID ${id}`);
        }

        return { permissions };
    }

}
