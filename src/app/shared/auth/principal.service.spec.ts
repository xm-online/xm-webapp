import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { XmSessionService } from '@xm-ngx/core';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { cloneDeep } from 'lodash';
import { JhiAlertService } from 'ng-jhipster';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { of } from 'rxjs';
import { AuthRefreshTokenService } from '../../../../packages/core/auth';
import { AccountService } from './account.service';
import { Principal } from './principal.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('PrincipalService', () => {

    let mockAlertService;
    let mockAccountService;
    let mockLocalStorage;
    let mockSessionStorage;
    let service: Principal;

    const mockedUser = {
        body: {
            id: 1,
            name: 'Iron man', imageUrl: 'someUrl', firstName: 'Tony', lastName: 'Stark',
            langKey: 'en', userKey: 'userKey',
            permissions: [{ privilegeKey: 'CAN_WALK', enabled: true }, { privilegeKey: 'CAN_FLY', enabled: true }],
        },
    };

    beforeEach(() => {
        mockAlertService = jasmine.createSpyObj(['warning']);
        mockAccountService = jasmine.createSpyObj(['get']);
        mockLocalStorage = jasmine.createSpyObj(['retrieve']);
        mockSessionStorage = jasmine.createSpyObj(['retrieve']);

        mockAccountService.get.and.returnValue(of(cloneDeep(mockedUser)));

        TestBed.configureTestingModule({
            imports: [XmTranslationTestingModule, MatSnackBarModule, HttpClientTestingModule],
            providers: [
                Principal,
                { provide: AccountService, useValue: mockAccountService },
                { provide: AuthRefreshTokenService, useValue: { isExpired: a => a, clear: a => a } },
                { provide: XmSessionService, useValue: { create: a => a, clear: a => a } },
                { provide: JhiAlertService, useValue: mockAlertService },
                { provide: LocalStorageService, useValue: mockLocalStorage },
                { provide: SessionStorageService, useValue: mockSessionStorage },
            ],
        });
        service = TestBed.inject<Principal>(Principal);
    });

    describe('isAuthenticated()', () => {
        it('should return false if identity not set', () => {
            expect(service.isAuthenticated()).toBe(false);
        });
        it('should be true if identity set', (done) => {
            service.identity().then(() => {
                expect(service.isAuthenticated()).toBe(true);
                done();
            });
        });
    });

    describe('logout()', () => {
        it('should do nothing if identity not set not set', () => {
            service.logout();
            expect(service.isAuthenticated()).toBe(false);
        });
        it('should return false after user logout', (done) => {
            expect(service.isAuthenticated()).toBe(false);
            service.identity().then(() => {
                expect(service.isAuthenticated()).toBe(true);
                service.logout();
                expect(service.isAuthenticated()).toBe(false);
                done();
            });
        });
    });

    describe('getName()', () => {
        it('should return null if identity not set', () => {
            expect(service.getName()).toBeNull();
        });
        it('should return first and second name', (done) => {
            service.identity().then(() => {
                expect(service.getName()).toBe('Tony Stark');
                done();
            });
        });
    });

    describe('getLangKey()', () => {
        it('should return null if identity not set', (done) => {
            expect(service.getLangKey()).toBeNull();
            done();
        });
        it('should return lang key', (done) => {
            service.identity().then(() => {
                expect(service.getLangKey()).toBe('en');
                done();
            });
        });
    });

    describe('setLangKey()', () => {
        it('should do nothing if identity not set', (done) => {
            service.setLangKey('en');
            expect(service.getLangKey()).toBeNull();
            done();
        });
        it('should se lang if identity set', (done) => {
            service.identity().then(() => {
                expect(service.getLangKey()).toBe('en');
                service.setLangKey('qw');
                expect(service.getLangKey()).toBe('qw');
                done();
            });
        });
    });

    describe('getUserKey()', () => {
        it('should return null if identity not set', () => {
            expect(service.getUserKey()).toBeNull();
        });
        it('should return user key', (done) => {
            service.identity().then(() => {
                expect(service.getUserKey()).toBe('userKey');
                done();
            });
        });
    });

    describe('getImageUrl()', () => {
        it('should return null if identity not set', () => {
            expect(service.getImageUrl()).toBeNull();
        });
        it('should return image url', (done) => {
            service.identity().then(() => {
                expect(service.getImageUrl()).toBe('someUrl');
                done();
            });
        });
    });

    describe('hasPrivileges()', () => {

        it('should return false if identity not set', (done) => {
            expect(service.isAuthenticated()).toBeFalsy();
            service.hasPrivileges().then((value) => {
                expect(value).toBeFalsy();
                done();
            });
        });

        it('should return false if stategy is not AND | OR', (done) => {
            expect(service.isAuthenticated()).toBeFalsy();
            service.hasPrivileges().then(() => {
                service.hasPrivileges(['CAN_FLY'], 'XOR').then((value) => {
                    expect(value).toBeFalsy();
                    done();
                });
            });
        });

        describe('OR strategy', () => {
            it('should return true for CAN_FLY or CAN_WALK or any of them', (done) => {
                expect(service.isAuthenticated()).toBeFalsy();
                service.identity().then(() => {
                    expect(service.isAuthenticated()).toBeTruthy();
                    service.hasPrivileges(['CAN_FLY']).then((value) => expect(value).toBeTruthy());
                    service.hasPrivileges(['CAN_WALK']).then((value) => expect(value).toBeTruthy());
                    service.hasPrivileges(['CAN_WALK', 'CAN_FLY']).then((value) => expect(value).toBeTruthy());
                    done();
                });
            });

            it('should return false for CAN_SWIM', (done) => {
                expect(service.isAuthenticated()).toBeFalsy();
                service.identity().then(() => {
                    expect(service.isAuthenticated()).toBeTruthy();
                    service.hasPrivileges(['CAN_SWIM']).then((value) => expect(value).toBeFalsy());
                    done();
                });
            });

        });

        describe('AND strategy', () => {
            it('should return empty if permissions present', (done) => {
                expect(service.isAuthenticated()).toBeFalsy();
                service.identity().then(() => {
                    expect(service.isAuthenticated()).toBeTruthy();
                    service.hasPrivileges(['CAN_WALK', 'CAN_FLY'], 'AND').then((value) => {
                        expect(value.length).toBe(0);
                    });
                    service.hasPrivileges(['CAN_WALK'], 'AND')
                        .then((value) => expect(value.length).toBe(0));
                    service.hasPrivileges(['CAN_FLY'], 'AND')
                        .then((value) => {
                            expect(value.length).toBe(0);
                            done();
                        });
                });
            });

            it('should return list of not assigned permissions', (done) => {
                expect(service.isAuthenticated()).toBeFalsy();
                service.identity().then(() => {
                    expect(service.isAuthenticated()).toBeTruthy();
                    const bulsitBingoArray = ['CAN_WALK', 'CAN_FLY',
                        'CAN_SWIM', 'CAN_DRINK_VODKA', 'CAN_PLAY_BALALAYKA'];
                    service.hasPrivileges(bulsitBingoArray, 'AND').then((value) => {
                        expect(value.length).toBe(3);
                        done();
                    });
                });
            });

        });
    });

    // TODO: xdescribe('hasAnyAuthority()', () => {});

});
