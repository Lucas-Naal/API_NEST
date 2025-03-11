import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from './entities/log.entity';
import { Module } from '../modules/entities/module.entity';
import { ModulesService } from '../modules/modules.service';
import { ActionType } from './dto/action-type.enum';

@Injectable()
export class LogService {
    constructor(
        @InjectRepository(Log)
        private readonly logRepository: Repository<Log>,
        private readonly modulesService: ModulesService,
    ) { }

    async createLog(
        usuario_id: number,
        action_name: ActionType,
        originalData: any,
        updatedData: any,
    ): Promise<Log> {
        const module = await this.modulesService.findOneByName('users');

        if (!module) {
            throw new NotFoundException('Module "users" not found');
        }

        const log = this.logRepository.create({
            module: module,
            usuario: { id: usuario_id } as any,
            action_name: action_name,
            original_data: originalData,
            updated_data: updatedData,
        });

        return this.logRepository.save(log);
    }

    async createLogRol(
        usuario_id: number,
        action_name: ActionType,
        originalData: any,
        updatedData: any
    ): Promise<Log> {
        const module = await this.modulesService.findOneByName('roles');

        if (!module) {
            throw new NotFoundException('Module "roles" not found');
        }

        const log = this.logRepository.create({
            module: module,  
            usuario: { id: usuario_id } as any,  
            action_name: action_name,  
            original_data: originalData,  
            updated_data: updatedData, 
        });

        return this.logRepository.save(log);
    }

    async createPermissionLog(
        usuario_id: number,
        action_name: ActionType,
        originalData: any,
        updatedData: any
    ): Promise<Log> {
        const module = await this.modulesService.findOneByName('permissions');

        if (!module) {
            throw new NotFoundException('Module "permissions" not found');
        }

        const log = this.logRepository.create({
            module: module,
            usuario: { id: usuario_id } as any,
            action_name: action_name,
            original_data: originalData,
            updated_data: updatedData,
        });

        return this.logRepository.save(log);
    }

    async getUserLogs(): Promise<Log[]> {
        return this.logRepository.query('SELECT id, usuario_id, module_name, action_name, original_data, updated_data, created_at FROM users_logs_view');
    }
    
    async getRoleLogs(): Promise<Log[]> {
        return this.logRepository.query('SELECT id, usuario_id, module_name, action_name, original_data, updated_data, created_at FROM roles_logs_view');
    }
    
    async getPermissionLogs(): Promise<Log[]> {
        return this.logRepository.query('SELECT id, usuario_id, module_name, action_name, original_data, updated_data, created_at FROM permissions_logs_view');
    }
    
    


}
