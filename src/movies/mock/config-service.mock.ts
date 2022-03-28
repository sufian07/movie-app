export class ConfigServiceMock {
    get(key: string) {
        return `mock_${key}`;
    }
}
