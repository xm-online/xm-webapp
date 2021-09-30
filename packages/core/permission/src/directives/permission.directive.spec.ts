import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { XmPermissionService } from '../xm-permission.service';
import { PermissionDirective } from './permission.directive';
import { MockPermissionService } from '@xm-ngx/core/permission/testing';

@Component({
    template: `
        <div *xmPermission="permissions" data-qa="permission-block">
            {{ content }}
        </div>
    `,
})
class HostComponent {
    public content = '';
    public permissions = null;
}

@Component({
    template: `
        <ng-template #noPermittedRef>{{falseContent}}</ng-template>
        <ng-template #hasPermittedRef>{{trueContent}}</ng-template>
        <ng-container *xmPermission="permissions; then hasPermittedRef; else noPermittedRef"></ng-container>
    `,
})
class HostThenComponent {
    public trueContent = 'trueContent';
    public falseContent = 'falseContent';
    public permissions = null;
}

describe('PermissionDirective', () => {

    let fixture: ComponentFixture<HostComponent>;
    let permissionService: XmPermissionService;

    function getElement() {
        return fixture.debugElement.query(By.css('div[data-qa="permission-block"]'));
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [{
                provide: XmPermissionService,
                useClass: MockPermissionService,
            }],
            declarations: [PermissionDirective, HostComponent, HostThenComponent],
        }).compileComponents();
        fixture = TestBed.createComponent(HostComponent);
        permissionService = TestBed.inject(XmPermissionService);
    });

    describe('validate permission with XmPermissionService', () => {

        it('undefined should create an instance', () => {
            fixture.componentInstance.permissions = undefined;
            fixture.detectChanges();
            const el = getElement();
            void expect(el).not.toEqual(null);
        });

        it('null should create an instance', () => {
            fixture.componentInstance.permissions = null;
            fixture.detectChanges();
            const el = getElement();
            void expect(el).not.toEqual(null);
        });

        it('empty string should create an instance', () => {
            fixture.componentInstance.permissions = '';
            fixture.detectChanges();
            const el = getElement();
            void expect(el).not.toEqual(null);
        });

        it('empty array should create an instance', () => {
            fixture.componentInstance.permissions = [];
            fixture.detectChanges();
            const el = getElement();
            void expect(el).not.toEqual(null);
        });

        it('true should create an instance', () => {
            fixture.componentInstance.permissions = true;
            fixture.detectChanges();
            const el = getElement();
            void expect(el).not.toEqual(null);
        });

        it('false should not create an instance', () => {
            fixture.componentInstance.permissions = false;
            fixture.detectChanges();
            const el = getElement();
            void expect(el).toEqual(null);
        });

        it('RIGHT_PERMISSION should create an instance', () => {
            fixture.componentInstance.permissions = 'RIGHT_PERMISSION';
            const changeStateSpy = spyOn(permissionService, 'hasPrivilegesBy').and.returnValue(of(true));
            fixture.detectChanges();

            const el = getElement();
            expect(changeStateSpy).toHaveBeenCalled();
            expect(el).not.toBe(null);
        });

        it('[RIGHT_PERMISSION] should create an instance', () => {
            fixture.componentInstance.permissions = ['RIGHT_PERMISSION'];
            const changeStateSpy = spyOn(permissionService, 'hasPrivilegesBy').and.returnValue(of(true));
            fixture.detectChanges();

            const el = getElement();
            expect(changeStateSpy).toHaveBeenCalled();
            expect(el).not.toBe(null);
        });

        it('[WRONG_PERMISSION] should create an instance', () => {
            fixture.componentInstance.permissions = ['WRONG_PERMISSION'];
            const changeStateSpy = spyOn(permissionService, 'hasPrivilegesBy').and.returnValue(of(false));
            fixture.detectChanges();

            const el = getElement();
            expect(changeStateSpy).toHaveBeenCalled();
            expect(el).toEqual(null);
        });

        it('should create and destroy an instance after sessionChanged', () => {
            const event = new BehaviorSubject(true);
            fixture.componentInstance.permissions = 'TRUE';
            const changeStateSpy = spyOn(permissionService, 'hasPrivilegesBy').and.returnValue(event);

            fixture.detectChanges();
            let el = getElement();
            expect(changeStateSpy).toHaveBeenCalled();
            expect(el).toBeInstanceOf(DebugElement);

            fixture.componentInstance.permissions = 'False';
            event.next(false);
            fixture.detectChanges();
            el = getElement();
            expect(changeStateSpy).toHaveBeenCalled();
            expect(el).toBe(null);

            event.complete();
        });

    });

    describe('validate if else directive', () => {
        it('TRUE should create trueContent', () => {
            const fixture2 = TestBed.createComponent(HostThenComponent);
            permissionService = TestBed.inject(XmPermissionService);
            fixture2.componentInstance.permissions = 'TRUE';
            const changeStateSpy = spyOn(permissionService, 'hasPrivilegesBy').and.returnValue(of(true));
            fixture2.detectChanges();

            expect(changeStateSpy).toHaveBeenCalled();
            expect(fixture2.componentRef.location.nativeElement.textContent)
                .toBe(fixture2.componentInstance.trueContent);
        });

        it('FALSE should create falseContent', () => {
            const fixture2 = TestBed.createComponent(HostThenComponent);
            permissionService = TestBed.inject(XmPermissionService);
            fixture2.componentInstance.permissions = 'FALSE';
            const changeStateSpy = spyOn(permissionService, 'hasPrivilegesBy').and.returnValue(of(false));
            fixture2.detectChanges();

            expect(changeStateSpy).toHaveBeenCalled();
            expect(fixture2.componentRef.location.nativeElement.textContent)
                .toBe(fixture2.componentInstance.falseContent);
        });
    });

});
