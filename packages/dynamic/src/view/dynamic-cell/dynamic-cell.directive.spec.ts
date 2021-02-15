import { DynamicCellDirective } from '@xm-ngx/dynamic';

describe('DynamicCellDirective', () => {
    it('should create an instance', () => {
        const directive = new DynamicCellDirective(null, null, null, null, null);
        expect(directive).toBeTruthy();
    });

    describe('getCellValue', () => {
        it('{field: \'test\'} should return row field', () => {
            const directive = new DynamicCellDirective(null, null, null, null, null);
            const row = { test: 1 }
            directive.row = row;
            directive.cell = {field: 'test', selector: null, options: null};
            expect(directive.getCellValue()).toEqual(row.test);
        });

        it('{field: null} should return null', () => {
            const directive = new DynamicCellDirective(null, null, null, null, null);
            const row = { test: 1 }
            directive.row = row;
            directive.cell = {field: null, selector: null, options: null};
            expect(directive.getCellValue()).toBeNull();
        });
    });

});
