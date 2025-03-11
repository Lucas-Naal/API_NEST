import { Controller, Post, Body, Get, Param, NotFoundException, UseGuards, Query } from '@nestjs/common';
import { LogService } from './log.service';
import { Log } from './entities/log.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('logs')
export class LogController {
    constructor(private readonly logService: LogService) { }

    @Get('logs/users')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all user logs' })
    @ApiResponse({ status: 200, description: 'User logs retrieved successfully.' })
    async getUserLogs(): Promise<Log[]> {
        return this.logService.getUserLogs();
    }
    
    @Get('logs/roles')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all role logs' })
    @ApiResponse({ status: 200, description: 'Role logs retrieved successfully.' })
    async getRoleLogs(): Promise<Log[]> {
        return this.logService.getRoleLogs();
    }
    
    @Get('logs/permissions')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all permission logs' })
    @ApiResponse({ status: 200, description: 'Permission logs retrieved successfully.' })
    async getPermissionLogs(): Promise<Log[]> {
        return this.logService.getPermissionLogs();
    }
    
}
