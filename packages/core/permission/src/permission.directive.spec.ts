import { PermissionDirective } from './permission.directive';
import { MockPermissionService } from './testing/mock-permission.service';

describe('PermissionDirective', () => {
    it('should create an instance', () => {
        const directive = new PermissionDirective(null, new MockPermissionService() as any, null);
        expect(directive).toBeTruthy();
    });
});
