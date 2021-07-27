import { Component, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable, Subject } from 'rxjs';
import { Principal } from '../../shared/auth/principal.service';
import { XmPermittedDirective } from './xm-permitted.directive';
import SpyObj = jasmine.SpyObj;


class MockPrincipal {
    public authenticationState: Subject<boolean> = new Subject<boolean>();

    public hasPrivileges(): Promise<boolean> {
        return Promise.resolve(true);
    }

    public getAuthenticationState(): Observable<boolean> {
        this.authenticationState.next(true);
        return this.authenticationState.asObservable();
    }
}

@Component({
    template: `
        <div>
            <button class="noPermission">noPermission</button>

            <button class="pOk" *permitted="['TEST_OK']">pOk</button>
            <button class="pNok" *permitted="['TEST_NOK']">pNok</button>

            <button class="pOk" *xmPermitted="['TEST_OK']">pOk</button>
            <button class="pNok" *xmPermitted="['TEST_NOK']">pNok</button>
            <button class="pOkCtxOk" *xmPermitted="['TEST_OK']; context:contextCB(true)">pOkCtxOk</button>
            <button class="pOkCtxNok" *xmPermitted="['TEST_OK']; context:contextCB(false)">pOkCtxNok</button>
            <button class="pNokCtxOk" *xmPermitted="['TEST_NOK']; context:contextCB(true)">pNokCtxOk</button>
            <button class="pNokCtxNok" *xmPermitted="['TEST_NOK']; context:contextCB(false)">pNokCtxNok</button>
        </div>`,
})
class TestComponent {
    public contextCB(value: boolean): () => boolean {
        return () => value;
    }
}

describe('XmPermittedDirective', () => {

    let fixture: ComponentFixture<TestComponent>;
    let mockPrincipalService: SpyObj<MockPrincipal>;
    let authenticationState: Subject<boolean>;

    const OK_SET = new Set(['noPermission', 'pOk', 'pOkCtxOk']);
    const NOK_SET = new Set(['pNok', 'pOkCtxNok', 'pNokCtxOk', 'pNokCtxNok']);

    const TEST_OK = 'TEST_OK';
    const TEST_NO_OK = 'TEST_NOK';

    const pResolver = (privileges: string[] = []) => {
        if (!privileges) {
            console.info('No privileges passed');
            return Promise.resolve(false);
        }

        if (privileges.length === 1 && TEST_OK === privileges[0]) {
            return Promise.resolve(true);
        }

        if (privileges.length === 1 && TEST_NO_OK === privileges[0]) {
            return Promise.resolve(false);
        }

        console.info('Resolve false, no match');
        return Promise.resolve(false);
    };

    beforeEach(waitForAsync(() => {

        mockPrincipalService = jasmine.createSpyObj<MockPrincipal>(['getAuthenticationState', 'hasPrivileges']);

        mockPrincipalService.hasPrivileges.and.callFake(pResolver);

        TestBed.configureTestingModule({
            declarations: [
                XmPermittedDirective,
                TestComponent,
            ],
            providers: [
                { provide: Principal, useValue: mockPrincipalService },
            ],
        });

        authenticationState = new Subject<boolean>();
        fixture = TestBed.createComponent(TestComponent);
    }));

    it('should be visible all elements from OK_SET', waitForAsync(() => {
        authenticationState.next(true);
        mockPrincipalService.getAuthenticationState.and.returnValue(authenticationState.asObservable());

        fixture.detectChanges();

        void fixture.whenStable().then(() => {
            const buttonComp = fixture.debugElement.queryAll(By.css('button')) as ElementRef<HTMLElement>[];
            for (const item of buttonComp) {
                void expect(OK_SET.has(item.nativeElement.textContent)).toBe(true);
            }
        });

    }));

    it('should not be visible all elements from NOK_SET', waitForAsync(() => {
        authenticationState.next(true);
        mockPrincipalService.getAuthenticationState.and.returnValue(authenticationState.asObservable());

        fixture.detectChanges();

        void fixture.whenStable().then(() => {
            const buttonComp = fixture.debugElement.queryAll(By.css('button')) as ElementRef<HTMLElement>[];
            for (const item of buttonComp) {
                void expect(NOK_SET.has(item.nativeElement.textContent)).toBe(false);
            }
        });

    }));
});
