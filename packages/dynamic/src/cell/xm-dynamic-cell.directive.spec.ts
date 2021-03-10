import { XmDynamicCellDirective } from '@xm-ngx/dynamic';

describe('XmDynamicCellDirective', () => {
    it('should create an instance', () => {
        const directive = new XmDynamicCellDirective(null, null, null, null, null);
        expect(directive).toBeTruthy();
    });

    describe('getCellValue', () => {
        it('{field: \'test\'} should return row field', () => {
            const directive = new XmDynamicCellDirective(null, null, null, null, null);
            const row = { test: 1 };
            directive.row = row;
            directive.cell = { field: 'test', selector: null, options: null, style: null, class: null };
            expect(directive.getCellValue()).toEqual(row.test);
        });

        it('{field: null} should return row', () => {
            const directive = new XmDynamicCellDirective(null, null, null, null, null);
            const row = { test: 1 };
            directive.row = row;
            directive.cell = { field: null, selector: null, options: null, style: null, class: null };
            expect(directive.getCellValue()).toEqual(row);
        });
    });

});
