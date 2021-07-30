import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XmBreadcrumbComponent } from './xm-breadcrumb.component';
import { MockXmBreadcrumbStore } from '@xm-ngx/components/breadcrumb/testing';
import { XmBreadcrumbStore } from '@xm-ngx/components/breadcrumb';

describe('XmBreadcrumbComponent', () => {
    let component: XmBreadcrumbComponent;
    let fixture: ComponentFixture<XmBreadcrumbComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [{ provide: XmBreadcrumbStore, useClass: MockXmBreadcrumbStore }],
            declarations: [XmBreadcrumbComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(XmBreadcrumbComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
