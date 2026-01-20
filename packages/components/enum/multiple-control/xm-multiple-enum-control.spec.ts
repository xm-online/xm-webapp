import { CommonModule } from '@angular/common';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XmMultipleEnumControl } from '@xm-ngx/components/enum';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { XmPermissionModule, XmPermissionService } from '@xm-ngx/core/permission';
import { MockPermissionService } from '@xm-ngx/core/permission/testing';
import { XmDynamicInstanceService } from '@xm-ngx/dynamic';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';

describe('XmMultipleEnumControlComponent', () => {
    let component: XmMultipleEnumControl;
    let fixture: ComponentFixture<XmMultipleEnumControl>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                { provide: XmPermissionService, useClass: MockPermissionService },
                {
                    provide: XmDynamicInstanceService, useValue: {
                        getControllerByKey: () => null,
                    },
                },
            ],
            imports: [
                XmMultipleEnumControl,
                CommonModule,
                MatIconModule,
                XmTranslationTestingModule,
                MatFormFieldModule,
                MatSelectModule,
                ReactiveFormsModule,
                XmPermissionModule,
                ControlErrorModule,
                ControlErrorModule.forRoot({ errorTranslates: XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES }),
                NoopAnimationsModule,
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent<XmMultipleEnumControl>(XmMultipleEnumControl);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('value boolean should be equal to options.items[i] value', () => {
        const value = false;
        const title = 'False';
        component.config = { dataQa: '', items: [{ value, title }, { value: '1', title: '1' }] };
        component.value = [value];
        fixture.detectChanges();
        expect(component.value).toEqual([value]);
        expect(component.itemsMap[String(value)].value).toBe(value);
    });

    it('value string should be equal to options.items[i] value', () => {
        const value = 'false';
        const title = 'False';
        component.value = [value];
        component.config = { dataQa: '', items: [{ value, title }, { value: 1, title: '1' }] };
        fixture.detectChanges();
        expect(component.value).toEqual([value]);
        expect(component.itemsMap[String(value)].value).toBe(value);
    });


    it('value number should be equal to options.items[i] value', () => {
        const value = 1;
        const title = 'False';
        component.value = [value];
        component.config = { dataQa: '', items: [{ value, title }, { value: 2, title: '1' }] };
        fixture.detectChanges();
        expect(component.value).toEqual([value]);
        expect(component.itemsMap[String(value)].value).toBe(value);
    });

    it('value number zero should be equal to options.items[i] value', () => {
        const value = 0;
        const title = 'False';
        component.value = [value];
        component.config = { dataQa: '', items: [{ value: 1, title: '1' }, { value, title }] };
        fixture.detectChanges();
        expect(component.value).toEqual([value]);
        expect(component.itemsMap[String(value)].value).toBe(value);
    });

    it('first element in value array should be equal to options.items[i] value', () => {
        const value = [1, 2, 3];
        const title = 'False';
        component.value = value;
        component.config = {
            dataQa: '',
            items: [{ value: value[0], title }, { value: value[1], title: '1' }, { value: value[2], title: '2' }],
        };
        fixture.detectChanges();
        expect(component.value).toEqual([1, 2, 3]);
        expect(component.itemsMap[String(value[0])].value).toEqual(value[0]);
    });
});
