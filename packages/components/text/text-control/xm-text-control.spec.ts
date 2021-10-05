import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { XmTextControl } from './xm-text-control';
import { ValidatorProcessingService, XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';

describe('XmTextControl', () => {
    let component: XmTextControl;
    let fixture: ComponentFixture<XmTextControl>;
    let validatorProcessingServiceMock: any;

    beforeEach(async(() => {
        validatorProcessingServiceMock = {
            validatorsFactory: jasmine.createSpy('validatorsFactory'),
        };

        TestBed.configureTestingModule({
            declarations: [XmTextControl],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [
                XmTranslationTestingModule,
                MatFormFieldModule,
                MatInputModule,
                ReactiveFormsModule,
                ControlErrorModule,
                ControlErrorModule.forRoot({errorTranslates: XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES}),
                NoopAnimationsModule,
            ],
            providers: [
                {
                    provide: ValidatorProcessingService,
                    useValue: validatorProcessingServiceMock,
                },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent<XmTextControl>(XmTextControl);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('value should be equal to form value via writeValue', () => {
        const value = 'value1';
        component.writeValue(value);
        expect(component.value).toBe(value);
        expect(component.control.value).toBe(value);
    });

    it('value should be equal to form value via control', () => {
        const value = 'value2';
        component.control = new FormControl(value);

        expect(component.value).toBe(value);
        expect(component.control.value).toBe(value);
    });

    it('value should be equal to form value after control change', () => {
        const value = 'value3';
        component.control = new FormControl(null);

        expect(component.value).toBeNull();
        expect(component.control.value).toBeNull();

        component.control = new FormControl(value);
        expect(component.value).toBe(value);
        expect(component.control.value).toBe(value);
    });


    it('value should be equal to form value after input value', () => {
        const value = 'value4';
        component.control = new FormControl(null);
        component.control.setValue(value);
        expect(component.value).toBe(value);
        expect(component.control.value).toBe(value);
    });

    it('value should be changed from input', () => {
        const value = 'value5';
        component.options.id = 'id';
        fixture.detectChanges();
        const input: HTMLInputElement = document.getElementById(component.options.id) as HTMLInputElement;
        input.value = value;
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(input.value).toBe(value);
        expect(component.control.value).toBe(value);
        expect(component.value).toBe(value);
    });

    it('should set formControl as newControl when applyTrimForValue equal true', () => {
        component.options.applyTrimForValue = true;

        expect(component.formControl)
            .toEqual((component as any).newControl);
    });

    it('should set formControl as control when applyTrimForValue equal false', () => {
        component.options.applyTrimForValue = false;

        expect(component.formControl)
            .toEqual((component as any).control);
    });

    describe('ngOnInit', () => {
        it('should call initControlWithTrimmingString when applyTrimForValue equal true', () => {
            spyOn((component as any), 'initControlWithTrimmingString');
            component.options.applyTrimForValue = true;
            component.ngOnInit();

            expect((component as any).initControlWithTrimmingString)
                .toHaveBeenCalled();
        });

        it('should NOT call initControlWithTrimmingString when applyTrimForValue equal false', () => {
            spyOn((component as any), 'initControlWithTrimmingString');
            component.options.applyTrimForValue = false;
            component.ngOnInit();

            expect((component as any).initControlWithTrimmingString)
                .not.toHaveBeenCalled();
        });
    });

    describe('getValueLength', () => {
        it('should return value.length when value is string', () => {
            component.value = 'test';

            expect(component.getValueLength())
                .toEqual(4);
        });

        it('should return 0 when value is empty', () => {
            component.value = '';

            expect(component.getValueLength())
                .toEqual(0);
        });

        it('should return 0 when value is null', () => {
            component.value = null;

            expect(component.getValueLength())
                .toEqual(0);
        });
    });

    describe('initControlWithTrimmingString', () => {
        it('should init value for newControl', () => {
            component.value = 'test1';

            (component as any).initControlWithTrimmingString();

            expect((component as any).newControl.value)
                .toEqual('test1');
        });

        it('should call validatorsFactory from validatorProcessingService', () => {
            (component as any).initControlWithTrimmingString();

            expect(validatorProcessingServiceMock.validatorsFactory)
                .toHaveBeenCalledWith(component.options?.validators);
        });

        it('should trim value from newControl and patch to control', () => {
            (component as any).newControl.patchValue(' test2 ');

            (component as any).initControlWithTrimmingString();

            expect(component.control.value)
                .toEqual('test2');
        });
    });
});
