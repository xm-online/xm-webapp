import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { XmDynamicModule } from '@xm-ngx/dynamic';

import { XmFormLayoutComponent } from './xm-form-layout.component';

describe('FormLayoutComponent', () => {
    let component: XmFormLayoutComponent;
    let fixture: ComponentFixture<XmFormLayoutComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [XmDynamicModule, XmFormLayoutComponent],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(XmFormLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
