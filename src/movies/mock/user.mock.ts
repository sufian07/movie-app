import { Payload } from '../../auth/interfaces/payload.interface';

export const getMockUser = (): Payload => {
    return {
        userId: 123,
        name: 'Test',
        role: 'basic',
        iat: 4556,
        exp: 4455,
        iss: 'string',
        sub: 'string',
    };
};
