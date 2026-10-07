import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { XmEventManager } from '@xm-ngx/core';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { XmToasterService } from '@xm-ngx/toaster';
import { JhiConfigService, JhiDateUtils, JhiModuleConfig } from '@xm-ngx/jhipster';
import { NgxWebstorageModule } from 'ngx-webstorage';

import { XmEntityService } from '@xm-ngx/core/entity';
import { AccountService } from '@xm-ngx/core/user';
import { Principal } from '@xm-ngx/core/user';
import { I18nJsfPipe } from '@xm-ngx/translation';
import { I18nNamePipe } from '@xm-ngx/translation';
import { EntityDetailDialogComponent } from './entity-detail-dialog.component';

describe('Entity detail dialog Component', () => {
    let component: EntityDetailDialogComponent;
    let fixture: ComponentFixture<EntityDetailDialogComponent>;
    let element: DebugElement;
    const PATTERN = '^(?=.*[a-z])[a-z0-9]{2,20}$';
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                XmTranslationTestingModule,
                FormsModule,
                MatSelectModule,
                NoopAnimationsModule,
                MatInputModule,
                NgxWebstorageModule.forRoot(),
                HttpClientTestingModule,
            ],
            declarations: [
                EntityDetailDialogComponent,
                I18nNamePipe,
                I18nJsfPipe,
            ],
            providers: [
                MatDialog,
                {provide: MatDialogRef, useValue: {}},
                {provide: XmEntityService, useValue: {}},
                I18nJsfPipe,
                I18nNamePipe,
                JhiDateUtils,
                XmEventManager,
                Principal,
                AccountService,
                XmToasterService,
                {
                    provide: JhiConfigService,
                    useValue: new JhiConfigService({defaultI18nLang: 'en', i18nEnabled: true}),
                },
                JhiModuleConfig,
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(EntityDetailDialogComponent);
        component = fixture.debugElement.componentInstance;
        component.isEdit = false;
    }));

    it('Should create component', waitForAsync(() => {
        expect(component).toBeTruthy();
    }));

    it('Name input should be empty', waitForAsync(() => {
        fixture.detectChanges();
        fixture.whenRenderingDone().then(() => {
            element = fixture.debugElement.query(By.css('#field_name'));
            expect(element.nativeElement.value).toBe('');
        });
    }));

    it('Should be no errors when no pattern', waitForAsync(() => {
        // Create fresh fixture to avoid NG0100
        const freshFixture = TestBed.createComponent(EntityDetailDialogComponent);
        const freshComponent = freshFixture.debugElement.componentInstance;
        freshComponent.isEdit = false;
        freshComponent.nameValidPattern = null;
        freshComponent.xmEntity = { name: '@e' };
        freshFixture.detectChanges();
        const freshError = freshFixture.debugElement.query(By.css('.has-error'));
        expect(freshError).toBeFalsy();
    }));

    it('Should have error class when input value dose`t match pattern', fakeAsync(() => {
        // Create fresh fixture to avoid NG0100
        const freshFixture = TestBed.createComponent(EntityDetailDialogComponent);
        const freshComponent = freshFixture.debugElement.componentInstance;
        freshComponent.isEdit = false;
        freshComponent.nameValidPattern = PATTERN;
        freshComponent.xmEntity = { name: '@w' };
        freshFixture.detectChanges();
        for (let i = 0; i < 100; i++) {
            tick(1);
        }
        freshFixture.detectChanges();
        const freshElement = freshFixture.debugElement.query(By.css('#field_name'));
        const classArr = freshElement.nativeElement.classList;
        let result;
        for (let i = 0; i < classArr.length; i++) {
            result = classArr[i] === 'ng-invalid';
        }
        expect(result).toBeTruthy();
    }));
});
