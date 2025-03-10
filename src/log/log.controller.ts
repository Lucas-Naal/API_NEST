// import { Controller, Post, Body, Get, Param, NotFoundException } from '@nestjs/common';
// import { LogService } from './log.service';
// import { Log } from './entities/log.entity';
// import { CreateLogDto } from './dto/create-log.dto'; // DTO para la creación de logs
// import { ActionType } from './dto/action-type.enum'; // Enum para las acciones posibles

// @Controller('logs')
// export class LogController {
//     constructor(private readonly logService: LogService) { }

//     // Ruta para obtener los logs por usuario
//     @Get('user/:userId')
//     async getLogsByUser(@Param('userId') userId: number): Promise<Log[]> {
//         const logs = await this.logService.getLogsByUser(userId);
//         if (!logs || logs.length === 0) {
//             throw new NotFoundException(`Logs not found for user with ID ${userId}`);
//         }
//         return logs;
//     }

//     // Ruta para obtener los logs por módulo
//     @Get('module/:moduleId')
//     async getLogsByModule(@Param('moduleId') moduleId: number): Promise<Log[]> {
//         const logs = await this.logService.getLogsByModule(moduleId);
//         if (!logs || logs.length === 0) {
//             throw new NotFoundException(`Logs not found for module with ID ${moduleId}`);
//         }
//         return logs;
//     }

//     // Ruta para crear un nuevo log
//     @Post()
//     async createLog(@Body() createLogDto: CreateLogDto): Promise<Log> {
//         return this.logService.createLog(createLogDto);
//     }
// }
