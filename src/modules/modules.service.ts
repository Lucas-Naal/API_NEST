import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Module } from "./entities/module.entity";

@Injectable()
export class ModulesService {
    constructor (
        @InjectRepository(Module)
        private readonly moduleRepository: Repository<Module>
    ){}

    async createModule(name: string): Promise<Module> {
        const module = this.moduleRepository.create({ name });
        return this.moduleRepository.save(module);
    }

    async findOneByName(name: string): Promise<Module | null> {
        return await this.moduleRepository.findOne({ where: { name } });
    }
}
