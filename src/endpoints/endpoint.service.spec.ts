// import { Test, TestingModule } from '@nestjs/testing';
// import { EndpointService } from './endpoints.service';
// import axios from 'axios';
// import MockAdapter from 'axios-mock-adapter';

// describe('EndpointService', () => {
//     let service: EndpointService;
//     let mockAxios: MockAdapter;

//     beforeEach(async () => {
//         const module: TestingModule = await Test.createTestingModule({
//             providers: [EndpointService],
//         }).compile();

//         service = module.get<EndpointService>(EndpointService);
//         mockAxios = new MockAdapter(axios);
//     });

//     afterEach(() => {
//         mockAxios.reset();
//     });

//     it('debe realizar una petición GET y devolver los datos correctamente', async () => {
//         const mockUrl = 'http://localhost:3000/api/test-get';
//         mockAxios.onGet(mockUrl).reply(200, [{ id: 1, name: 'Test' }]);

//         const result = await service.analyzeEndpoint(mockUrl, 'GET');
        
//         expect(result).toEqual({
//             url: mockUrl,
//             status: 200,
//             responseTime: expect.any(String),
//             dataCount: 1,
//             action: 'GET',
//         });
//     });

//     it('debe realizar una petición POST con token y devolver los datos', async () => {
//         const mockUrl = 'http://localhost:3000/api/test-post';
//         const mockToken = 'fake-token';
//         const mockBody = { name: 'Luis' };

//         mockAxios.onPost(mockUrl).reply(201, { success: true });

//         const result = await service.analyzeEndpoint(mockUrl, 'POST', mockToken, mockBody);
        
//         expect(result).toEqual({
//             url: mockUrl,
//             status: 201,
//             responseTime: expect.any(String),
//             dataCount: 1,
//             action: 'POST',
//         });
//     });

//     it('debe manejar error 401 si el endpoint requiere autenticación', async () => {
//         const mockUrl = 'http://localhost:3000/api/private-data';

//         mockAxios.onGet(mockUrl).reply(401, { error: 'Unauthorized' });

//         const result = await service.analyzeEndpoint(mockUrl, 'GET');
        
//         expect(result).toEqual({
//             url: mockUrl,
//             status: 401,
//             responseTime: 'Failed',
//             error: 'Request failed with status code 401',
//             action: 'GET',
//         });
//     });

//     it('debe manejar error 500 si el servidor falla', async () => {
//         const mockUrl = 'http://localhost:3000/api/error';

//         mockAxios.onGet(mockUrl).reply(500, { error: 'Server Error' });

//         const result = await service.analyzeEndpoint(mockUrl, 'GET');

//         expect(result).toEqual({
//             url: mockUrl,
//             status: 500,
//             responseTime: 'Failed',
//             error: 'Request failed with status code 500',
//             action: 'GET',
//         });
//     });
// });
