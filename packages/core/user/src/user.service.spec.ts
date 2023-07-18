import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';

describe('UserService', () => {

    const resourceUrl = 'uaa/api/users';
    const userOnline = 'uaa/api/onlineUsers';
    let service: UserService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                UserService,
            ],
        });
        httpTestingController = TestBed.inject<HttpTestingController>(HttpTestingController);
        service = TestBed.inject<UserService>(UserService);
    });

    describe('create()', () => {
        it('should call with correct URL', (done) => {
            service.create({}).subscribe(() => done());
            const req = httpTestingController.expectOne(resourceUrl);
            req.flush({ id: 1 });
            httpTestingController.verify();
        });
    });

    describe('update()', () => {
        it('should call with correct URL', (done) => {
            service.update({}).subscribe(() => done());
            const req = httpTestingController.expectOne(resourceUrl);
            req.flush({ id: 1 });
            httpTestingController.verify();
        });
    });

    describe('getOnlineUsers()', () => {
        it('should call with correct URL', (done) => {
            service.getOnlineUsers().subscribe(() => done());
            const req = httpTestingController.expectOne(userOnline);
            req.flush({});
            httpTestingController.verify();
        });
    });

    describe('disable2FA()', () => {
        it('should call with correct URL', (done) => {
            const userID = '111';
            service.disable2FA(userID).subscribe(() => done());
            const req = httpTestingController.expectOne(resourceUrl + '/' + userID + '/tfa_disable');
            req.flush({});
            httpTestingController.verify();
        });
    });

    describe('enable2FA()', () => {
        it('should call with correct URL', (done) => {
            const userID = '111';
            const email = '';
            service.enable2FA(userID, email).subscribe(() => done());
            const req = httpTestingController.expectOne(resourceUrl + '/' + userID + '/tfa_enable');
            req.flush({});
            httpTestingController.verify();
        });
    });

});
