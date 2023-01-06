import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {JhiDateUtils} from 'ng-jhipster';
import {SERVER_API_URL} from '../../../../src/app/xm.constants';
import {AccountService} from './account.service';
import {ACCOUNT_LOGIN_UPDATE_URL, ACCOUNT_TFA_DISABLE_URL, ACCOUNT_TFA_ENABLE_URL, ACCOUNT_URL} from './auth.constants';

describe('AccountService', () => {

    let service: AccountService;
    let httpTestingController: HttpTestingController;

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
    });

    describe('get()', () => {
        it('should call with correct URL', (done) => {
            service.get().subscribe(() => done());
            const req = httpTestingController.expectOne(SERVER_API_URL + ACCOUNT_URL);
            req.flush({id: 1});
            httpTestingController.verify();
        });

    });

    describe('save()', () => {
        it('should call with correct URL', (done) => {
            service.save({id: 100}).subscribe(() => done());
            const req = httpTestingController.expectOne(SERVER_API_URL + ACCOUNT_URL);
            req.flush({id: 1});
            httpTestingController.verify();
        });

    });

    describe('updateLogins()', () => {
        it('should call with correct URL', (done) => {
            service.updateLogins({id: 100}).subscribe(() => done());
            const req = httpTestingController.expectOne(SERVER_API_URL + ACCOUNT_LOGIN_UPDATE_URL);
            req.flush({id: 1});
            httpTestingController.verify();
        });
    });

    describe('enableTFA()', () => {
        it('should call with correct URL', (done) => {
            service.enableTFA('test', 'test').subscribe(() => done());
            const req = httpTestingController.expectOne(SERVER_API_URL + ACCOUNT_TFA_ENABLE_URL);
            req.flush({id: 1});
            httpTestingController.verify();
        });
    });

    describe('disableTFA()', () => {
        it('should call with correct URL', (done) => {
            service.disableTFA().subscribe(() => done());
            const req = httpTestingController.expectOne(SERVER_API_URL + ACCOUNT_TFA_DISABLE_URL);
            req.flush({id: 1});
            httpTestingController.verify();
        });
    });

});
