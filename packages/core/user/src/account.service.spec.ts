import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { JhiDateUtils } from '@xm-ngx/jhipster';
import { AccountService } from './account.service';
import { ACCOUNT_LOGIN_UPDATE_URL, ACCOUNT_TFA_DISABLE_URL, ACCOUNT_TFA_ENABLE_URL } from '@xm-ngx/core/auth';
import { ACCOUNT_URL } from '@xm-ngx/core';

describe('AccountService', () => {

    let service: AccountService;
    let httpTestingController: HttpTestingController;
    let accountUrl: string;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                AccountService,
                JhiDateUtils,
            ],
        });
        httpTestingController = TestBed.inject<HttpTestingController>(HttpTestingController);
        service = TestBed.inject<AccountService>(AccountService);
        accountUrl = TestBed.inject<string>(ACCOUNT_URL);
    });

    describe('get()', () => {
        it('should call with correct URL', (done) => {
            service.get().subscribe(() => done());
            const req = httpTestingController.expectOne(accountUrl);
            req.flush({id: 1});
            httpTestingController.verify();
        });

    });

    describe('save()', () => {
        it('should call with correct URL', (done) => {
            service.save({id: 100}).subscribe(() => done());
            const req = httpTestingController.expectOne(accountUrl);
            req.flush({id: 1});
            httpTestingController.verify();
        });

    });

    describe('updateLogins()', () => {
        it('should call with correct URL', (done) => {
            service.updateLogins({id: 100}).subscribe(() => done());
            const req = httpTestingController.expectOne(ACCOUNT_LOGIN_UPDATE_URL);
            req.flush({id: 1});
            httpTestingController.verify();
        });
    });

    describe('enableTFA()', () => {
        it('should call with correct URL', (done) => {
            service.enableTFA('test', 'test').subscribe(() => done());
            const req = httpTestingController.expectOne(ACCOUNT_TFA_ENABLE_URL);
            req.flush({id: 1});
            httpTestingController.verify();
        });
    });

    describe('disableTFA()', () => {
        it('should call with correct URL', (done) => {
            service.disableTFA().subscribe(() => done());
            const req = httpTestingController.expectOne(ACCOUNT_TFA_DISABLE_URL);
            req.flush({id: 1});
            httpTestingController.verify();
        });
    });

});
