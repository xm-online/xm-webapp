import { TestBed } from '@angular/core/testing';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';

import { XmAuthenticationStoreService } from './xm-authentication-store.service';

describe('XmAuthenticationStoreService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        providers: [
            { provide: SessionStorageService, useValue: {} },
            { provide: LocalStorageService, useValue: {} },
            XmAuthenticationStoreService],
    }));

    it('should be created', () => {
        const service: XmAuthenticationStoreService = TestBed.inject<XmAuthenticationStoreService>(XmAuthenticationStoreService);
        expect(service).toBeTruthy();
    });
});
