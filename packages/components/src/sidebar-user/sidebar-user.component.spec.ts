import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { XmSharedTestingModule } from '@xm-ngx/shared';

import { SidebarUserComponent } from './sidebar-user.component';

describe('SidebarUserComponent', () => {
    let component: SidebarUserComponent;
    let fixture: ComponentFixture<SidebarUserComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            imports: [XmSharedTestingModule, HttpClientTestingModule, RouterTestingModule],
            declarations: [SidebarUserComponent],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarUserComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
