import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiBody } from '@nestjs/swagger';
import { EndpointService } from './endpoints.service';

@ApiTags('Endpoint Analysis')
@Controller('endpoint')
export class EndpointController {
    constructor(private readonly endpointService: EndpointService) {}

    @Post('analyze')
    @ApiOperation({ summary: 'Analyze an endpoint response' })
    @ApiQuery({ name: 'url', type: String, description: 'Endpoint to analyze', required: true })
    @ApiQuery({ name: 'method', type: String, description: 'HTTP Method (GET, POST)', required: true })
    @ApiQuery({ name: 'token', type: String, description: 'Bearer token for authentication', required: false })
    @ApiBody({ 
        description: 'Request body for POST requests (optional)', 
        type: Object, 
        required: false 
    })
    @ApiResponse({ status: 200, description: 'Successful analysis' })
    @ApiResponse({ status: 400, description: 'Invalid URL or request error' })
    async analyzeEndpoint(
        @Query('url') url: string,
        @Query('method') method: string,
        @Query('token') token: string,
        @Body() body?: any 
    ) {
        return this.endpointService.analyzeEndpoint(url, method, token, body);
    }
}
