import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { XM_DYNAMIC_EXTENSIONS, XmDynamicCellDirective, XmDynamicModule } from '@xm-ngx/dynamic';

@Component({
    selector: 'mock-xm-dynamic-cell',
    template: `
        <xm-dynamic-cell
                [row]="{c: true}"
                [cell]="{field: 'c', selector: '@xm-ngx/components/xm-bool-view'}"
        ></xm-dynamic-cell>
    `,
    standalone: false,
})
class MockXmDynamicCellComponent {
}

describe('XmDynamicCellDirective', () => {
    let directive: XmDynamicCellDirective<unknown, any>;
    let fixture: ComponentFixture<MockXmDynamicCellComponent>;

    beforeEach(() => {
        fixture = TestBed.configureTestingModule({
            declarations: [
                MockXmDynamicCellComponent,
                XmDynamicCellDirective,
            ],
            imports: [
                XmDynamicModule.forRoot([]),
            ],
            providers: [
                {provide: XM_DYNAMIC_EXTENSIONS, useValue: XM_DYNAMIC_EXTENSIONS},
            ],
        }).createComponent(MockXmDynamicCellComponent);

        const el: DebugElement = fixture.debugElement.query(By.directive(XmDynamicCellDirective));
        directive = el.injector.get(XmDynamicCellDirective);
        fixture.detectChanges();
    });

    it('should create an instance', () => {
        expect(directive).toBeTruthy();
    });

    describe('getCellValue', () => {
        it('{field: \'test\'} should return row field', () => {
            const row = {test: 1};
            directive.row = row;
            directive.cell = {field: 'test', selector: null, options: null, style: null, class: null};
            expect(directive.getCellValue()).toEqual(row.test);
        });

        it('{field: null} should return row', () => {
            const row = {test: 1};
            directive.row = row;
            directive.cell = {field: null, selector: null, options: null, style: null, class: null};
            expect(directive.getCellValue()).toEqual(row);
        });
    });

});
