import { Component, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { XmPermissionService, XmPermittedDirective } from '@xm-ngx/core/permission';
import { MockPermissionService } from '@xm-ngx/core/permission/testing';
import SpyObj = jasmine.SpyObj;

@Component({
    template: `
        <div>
            <button class="withoutPermission">withoutPermission</button>

            <button class="emptyPermission" *permitted="[]">emptyPermission</button>
            <button class="nullPermission" *permitted="null">nullPermission</button>

            <button class="existPermission" *permitted="['TEST_OK']">existPermission</button>
            <button class="notExistPermission" *permitted="['TEST_NOK']">notExistPermission</button>

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
    let mockPrincipalService: SpyObj<MockPermissionService>;

    const OK_SET = new Set([
        'withoutPermission',
        'pOk',
        'pdOk',
        'existPermission',
        'pOkCtxOk',
    ]);
    const NOK_SET = new Set([
        'emptyPermission',
        'nullPermission',
        'pNok',
        'notExistPermission',
        'pdNok',
        'pOkCtxNok',
        'pNokCtxOk',
        'pNokCtxNok',
    ]);

    const TEST_OK = 'TEST_OK';
    const TEST_NO_OK = 'TEST_NOK';

    const pResolver = (privileges: string[] = []) => {
        if (!privileges) {
            console.info('No privileges passed');
            return of(false);
        }

        if (privileges.length === 1 && TEST_OK === privileges[0]) {
            return of(true);
        }

        if (privileges.length === 1 && TEST_NO_OK === privileges[0]) {
            return of(false);
        }

        throw new Error('Resolve false, no match');
    };

    beforeEach(waitForAsync(() => {

        mockPrincipalService = jasmine.createSpyObj<MockPermissionService>(['hasPrivileges', 'permissions$']);

        mockPrincipalService.hasPrivileges.and.callFake(pResolver);
        mockPrincipalService.permissions$.and.callFake(() => of<[]>([]));

        TestBed.configureTestingModule({
            declarations: [
                XmPermittedDirective,
                TestComponent,
            ],
            providers: [
                { provide: XmPermissionService, useValue: mockPrincipalService },
            ],
        });

        fixture = TestBed.createComponent(TestComponent);
    }));

    it('should be visible all elements from OK_SET', waitForAsync(() => {
        fixture.detectChanges();

        void fixture.whenStable().then(() => {
            const buttonComp = fixture.debugElement.queryAll(By.css('button')) as ElementRef<HTMLElement>[];
            for (const item of buttonComp) {
                void expect(OK_SET.has(item.nativeElement.textContent)).toBe(true);
            }
        });

    }));

    it('should not be visible all elements from NOK_SET', waitForAsync(() => {
        fixture.detectChanges();

        void fixture.whenStable().then(() => {
            const buttonComp = fixture.debugElement.queryAll(By.css('button')) as ElementRef<HTMLElement>[];
            for (const item of buttonComp) {
                void expect(NOK_SET.has(item.nativeElement.textContent)).toBe(false);
            }
        });

    }));
});
