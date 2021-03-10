import { TestBed } from '@angular/core/testing';

import { SignInService } from './sign-in.service';

describe('XmSignInService', () => {
    let service: SignInService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SignInService],
        });
        service = TestBed.inject<SignInService>(SignInService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
