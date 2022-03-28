export const modelMock = () => ({
    new: jest.fn().mockResolvedValue({}),
    constructor: jest.fn().mockResolvedValue({}),
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    count: jest.fn(),
});
