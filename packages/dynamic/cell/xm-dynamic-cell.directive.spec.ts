import { XmDynamicCellDirective } from './xm-dynamic-cell.directive';
import { MockXmDynamicComponentRegistry } from '@xm-ngx/dynamic/testing';


describe('GIVEN XmDynamicCellDirective', () => {
    it('WHEN instance THEN should create an instance', () => {
        const directive = new XmDynamicCellDirective<unknown, unknown>(null, null, null, new MockXmDynamicComponentRegistry());
        expect(directive).toBeTruthy();
    });

    describe('WHEN getCellValue', () => {
        it('THEN {field: \'test\'} should return row field', () => {
            const directive = new XmDynamicCellDirective<unknown, unknown>(null, null, null, new MockXmDynamicComponentRegistry());
            const row = { test: 1 };
            directive.row = row;
            directive.cell = { field: 'test', selector: null, options: null, style: null, class: null };
            expect(directive.getCellValue()).toEqual(row.test);
        });

        it('THEN {field: null} should return row', () => {
            const directive = new XmDynamicCellDirective<unknown, unknown>(null, null, null, new MockXmDynamicComponentRegistry());
            const row = { test: 1 };
            directive.row = row;
            directive.cell = { field: null, selector: null, options: null, style: null, class: null };
            expect(directive.getCellValue()).toEqual(row);
        });
    });

    describe('WHEN createComponent', () => {
        it('THEN {config: TRUEss} should return instance with options and config TRUE', async () => {
            const directive = new XmDynamicCellDirective<unknown, string>(null, null, null, new MockXmDynamicComponentRegistry());
            const row = { test: 1 };
            directive.row = row;
            directive.cell = { field: null, selector: 'any', options: null, style: null, class: null, config: 'TRUE' };
            await directive['createComponent']();
            expect(directive.instance.config).toEqual('TRUE');
            expect(directive.instance.options).toEqual('TRUE');
        });


        it('THEN {options: TRUE} should return instance with options and config TRUE', async () => {
            const directive = new XmDynamicCellDirective<unknown, string>(null, null, null, new MockXmDynamicComponentRegistry());
            const row = { test: 1 };
            directive.row = row;
            directive.cell = { field: null, selector: 'any', options: 'TRUE', style: null, class: null, config: null };
            await directive['createComponent']();
            expect(directive.instance.config).toEqual('TRUE');
            expect(directive.instance.options).toEqual('TRUE');
        });
    });

});
