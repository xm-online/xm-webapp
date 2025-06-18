import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { XmSessionService } from '@xm-ngx/core';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { of } from 'rxjs';
import { Principal } from '@xm-ngx/core/user';
import { AccountService } from '@xm-ngx/core/user';

import { ImageLogoComponent } from './image-logo.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('ImageLogoComponent', () => {
    let component: ImageLogoComponent;
    let fixture: ComponentFixture<ImageLogoComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            imports: [ImageLogoComponent, RouterTestingModule, XmTranslationTestingModule],
            providers: [
                { provide: XmSessionService, useValue: { get: () => of({}) } },
                { provide: Principal, useValue: {} },
                { provide: AccountService, useValue: {} },
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
