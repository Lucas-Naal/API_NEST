import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class EndpointService {

    async analyzeEndpoint(url: string, method: string, token?: string, body?: any): Promise<any> {
        const startTime = Date.now();

        try {
            let response;

            if (method.toUpperCase() === 'POST') {
                response = await axios.post(url, body, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });
            } else {
                response = await axios.get(url, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });
            }

            const endTime = Date.now();
            const responseTime = endTime - startTime;

            let extractedData;
            if (Array.isArray(response.data)) {
                extractedData = response.data.slice(0, 3); 
            } else if (typeof response.data === 'object') {
                const keys = Object.keys(response.data);
                extractedData = keys.slice(0, 3).reduce((acc, key) => {
                    acc[key] = response.data[key];
                    return acc;
                }, {});
            } else {
                extractedData = response.data; 
            }

            return {
                url,
                status: response.status,
                responseTime: `${responseTime}ms`,
                dataCount: Array.isArray(response.data) ? response.data.length : 1,
                sampleData: extractedData, 
                action: method.toUpperCase(),
            };
        } catch (error) {
            return {
                url,
                status: error.response ? error.response.status : 'Unknown',
                responseTime: 'Failed',
                error: error.message,
                action: method.toUpperCase(),
            };
        }
    }
}
