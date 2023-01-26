import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';

import { TableHeaderComponent } from './table-header.component';

describe('TableHeaderComponent', () => {
    let component: TableHeaderComponent;
    let fixture: ComponentFixture<TableHeaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [XmTranslationTestingModule],
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [TableHeaderComponent],
        })
            .compileComponents();

        fixture = TestBed.createComponent(TableHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
