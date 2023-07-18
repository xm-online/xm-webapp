export class MockPrincipalService {
    public identity(): Promise<null> {
        return Promise.resolve(null);
    }

    public hasPrivileges(): Promise<boolean> {
        return Promise.resolve(null);
    }
}
