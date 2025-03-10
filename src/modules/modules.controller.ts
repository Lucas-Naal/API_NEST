import { Controller, Get, Post, Body, Param, NotFoundException } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { Module } from './entities/module.entity';
import { CreateModuleDto } from './dto/create-module.dto'; 

@Controller('modules')
export class ModulesController {
    constructor(private readonly modulesService: ModulesService) { }

    @Get(':name')
    async getModuleByName(@Param('name') name: string): Promise<Module> {
        const module = await this.modulesService.findOneByName(name);
        if (!module) {
            throw new NotFoundException(`Module with name "${name}" not found`);
        }
        return module;
    }

    @Post()
    async createModule(@Body() createModuleDto: CreateModuleDto): Promise<Module> {
        return this.modulesService.createModule(createModuleDto.name);
    }
}
