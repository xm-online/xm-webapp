import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XmEnumControl } from '@xm-ngx/components/enum';
import { XmPermissionModule, XmPermissionService } from '@xm-ngx/core/permission';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { MockPermissionService } from '@xm-ngx/core/permission/testing';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { XmDynamicInjectionTokenStoreService, XmDynamicInstanceService } from '@xm-ngx/dynamic';

describe('XmEnumControlComponent', () => {
    let component: XmEnumControl;
    let fixture: ComponentFixture<XmEnumControl>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [],
            providers: [{ provide: XmPermissionService, useClass: MockPermissionService }, XmDynamicInstanceService, XmDynamicInjectionTokenStoreService],
            imports: [
                XmEnumControl,
                CommonModule,
                MatIconModule,
                XmTranslationTestingModule,
                MatFormFieldModule,
                MatSelectModule,
                ReactiveFormsModule,
                XmPermissionModule,
                ControlErrorModule,
                ControlErrorModule.forRoot({errorTranslates: XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES}),
                NoopAnimationsModule,
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent<XmEnumControl>(XmEnumControl);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('value boolean should be equal to options.items[0] value', () => {
        const value = false;
        const title = 'False';
        component.config = { dataQa: '', items: [{ value, title }, { value: '1', title: '1' }] };
        component.value = value;
        fixture.detectChanges();
        expect(component.value).toBe(value);
        expect(component.itemsMap[String(value)].value).toBe(value);
    });

    it('value string should be equal to options.items[0] value', () => {
        const value = 'false';
        const title = 'False';
        component.value = value;
        component.config = { dataQa: '', items: [{ value, title }, { value: 1, title: '1' }] };
        fixture.detectChanges();
        expect(component.value).toBe(value);
        expect(component.itemsMap[String(value)].value).toBe(value);
    });

    it('value number should be equal to options.items[0] value', () => {
        const value = 1;
        const title = 'False';
        component.value = value;
        component.config = { dataQa: '', items: [{ value, title }, { value: 1, title: '1' }] };
        fixture.detectChanges();
        expect(component.value).toBe(value);
        expect(component.itemsMap[String(value)].value).toBe(value);
    });

    it('value number zero should be equal to options.items[0] value', () => {
        const value = 0;
        const title = 'False';
        component.value = value;
        component.config = { dataQa: '', items: [{ value, title }, { value: 1, title: '1' }] };
        fixture.detectChanges();
        expect(component.value).toBe(value);
        expect(component.itemsMap[String(value)].value).toBe(value);
    });
});
