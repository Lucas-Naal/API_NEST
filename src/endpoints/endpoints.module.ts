import { Module } from '@nestjs/common';
import { EndpointService } from './endpoints.service';
import { EndpointController } from './endpoints.controller';

@Module({
    controllers: [EndpointController],
    providers: [EndpointService],
})
export class EndpointModule {}
