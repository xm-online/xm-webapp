import { Component, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder, NgControl } from '@angular/forms';
import { FormGroupLayoutFactoryService } from '@xm-ngx/components/form-layout';
import { MockFormGroupLayoutFactoryService } from '@xm-ngx/components/form-layout/testing';
import { ValidatorProcessingService } from '@xm-ngx/components/validator-processing';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';

import { FiltersControlComponent } from './filters-control.component';

@Component({
    selector: 'xm-form-layout, [xm-form-layout]',
    template: 'mock',
})
class MockFormLayoutComponent {
    @Input() public value: unknown;
    @Input() public options: unknown;
}

describe('FiltersControlComponent', () => {
    let component: FiltersControlComponent;
    let fixture: ComponentFixture<FiltersControlComponent<any>>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: NgControl, useValue: null },
                { provide: FormGroupLayoutFactoryService, useClass: MockFormGroupLayoutFactoryService },
                ValidatorProcessingService,
                UntypedFormBuilder,
            ],
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [FiltersControlComponent, MockFormLayoutComponent],
            imports: [XmTranslationTestingModule],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FiltersControlComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
