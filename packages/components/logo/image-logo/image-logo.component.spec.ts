import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { XmSessionService } from '@xm-ngx/core';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { of } from 'rxjs';
import { Principal } from '@xm-ngx/core/user';
import { AccountService } from '@xm-ngx/core/user';
import { DashboardStore } from '@xm-ngx/core/dashboard';
import { ImageLogoComponent } from './image-logo.component';
import { RouterTestingModule } from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';

class Mock {
}

describe('ImageLogoComponent', () => {
    let component: ImageLogoComponent;
    let fixture: ComponentFixture<ImageLogoComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            imports: [ImageLogoComponent, RouterTestingModule, XmTranslationTestingModule, HttpClientTestingModule],
            providers: [
                { provide: XmSessionService, useValue: { get: () => of({}) } },
                { provide: Principal, useValue: {} },
                { provide: AccountService, useValue: {} },
                { provide: DashboardStore, useClass: Mock },
            ],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ImageLogoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
