import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FeedbackService } from '@xm-ngx/components/feedback/feedback.service';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';
import { XmToasterService } from '@xm-ngx/toaster';

import { FeedbackComponent } from './feedback.component';
import { MatDialogModule } from '@angular/material/dialog';

describe('FeedbackComponent', () => {
    let component: FeedbackComponent;
    let fixture: ComponentFixture<FeedbackComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            imports: [XmTranslationTestingModule, MatDialogModule, HttpClientTestingModule],
            declarations: [FeedbackComponent],
            providers: [
                { provide: XmToasterService, useValue: null },
                { provide: FeedbackService, useValue: null },
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FeedbackComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
