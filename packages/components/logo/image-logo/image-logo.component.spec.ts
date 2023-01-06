import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { XmSessionService } from '@xm-ngx/core';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { of } from 'rxjs';

import { ImageLogoComponent } from './image-logo.component';

describe('ImageLogoComponent', () => {
    let component: ImageLogoComponent;
    let fixture: ComponentFixture<ImageLogoComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            imports: [XmTranslationTestingModule],
            declarations: [ImageLogoComponent],
            providers: [{ provide: XmSessionService, useValue: { get: () => of({}) } }],
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
