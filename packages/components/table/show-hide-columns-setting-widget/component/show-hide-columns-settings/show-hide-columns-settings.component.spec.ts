import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowHideColumnsSettingsComponent } from './show-hide-columns-settings.component';
import { of } from 'rxjs';
import { XmSharedTestingModule } from '@xm-ngx/shared';
import { ColumnsSettingStorageService } from '../../../service/columns-settings-storage.service';
import { UntypedFormBuilder } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ShowHideColumnsSettingsComponent', () => {
    let component: ShowHideColumnsSettingsComponent;
    let fixture: ComponentFixture<ShowHideColumnsSettingsComponent>;
    let mocks: any;

    beforeEach(async () => {
        mocks = {
            columnsSettingStorageService: {
                getStore: jasmine.createSpy('getStore').and.returnValue(of([])),
                updateStore: jasmine.createSpy('updateStore'),
            },
        };
        await TestBed.configureTestingModule({
            imports: [
                XmSharedTestingModule,
                BrowserAnimationsModule,
            ],
            declarations: [ShowHideColumnsSettingsComponent],
            providers: [
                {
                    provide: ColumnsSettingStorageService,
                    useValue: mocks.columnsSettingStorageService,
                },
                UntypedFormBuilder,
            ],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ShowHideColumnsSettingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
