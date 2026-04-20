import { TestBed } from '@angular/core/testing';
import { FilterByPropertyPathController } from './filter-by-property-path.controller';
import { XmKeyFilterConfig, XmKeyFilterValue } from '@xm-ngx/components/key-filter';

describe('FilterByPropertyPathController', () => {
    let controller: FilterByPropertyPathController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [FilterByPropertyPathController],
        });
        controller = TestBed.inject(FilterByPropertyPathController);
    });

    describe('prepareValue', () => {
        it('should return value unchanged when propertyPath is not defined', () => {
            const value: XmKeyFilterValue = [{ name: 'item1' }, { name: 'item2' }];
            const config = {} as XmKeyFilterConfig;

            const result = controller.prepareValue(value, config);

            expect(result).toBe(value);
        });

        it('should filter value by propertyPath when propertyPath is defined', () => {
            const value: XmKeyFilterValue = [
                { name: 'item1', active: true },
                { name: 'item2' },
            ];
            const config = { propertyPath: 'active' } as XmKeyFilterConfig;

            const result = controller.prepareValue(value, config);

            expect(result).toEqual([{ name: 'item1', active: true }]);
        });

        it('should return empty array when no items match propertyPath', () => {
            const value: XmKeyFilterValue = [{ name: 'item1' }, { name: 'item2' }];
            const config = { propertyPath: 'nonExistent' } as XmKeyFilterConfig;

            const result = controller.prepareValue(value, config);

            expect(result).toEqual([]);
        });
    });

    describe('filterByPropertyPath', () => {
        it('should filter items that have the given path', () => {
            const data = [
                { a: { b: 1 } },
                { a: {} },
                { c: 1 },
            ];

            const result = controller.filterByPropertyPath(data, 'a.b');

            expect(result).toEqual([{ a: { b: 1 } }]);
        });

        it('should return all items when all have the path', () => {
            const data = [{ x: 1 }, { x: 2 }, { x: 3 }];

            const result = controller.filterByPropertyPath(data, 'x');

            expect(result).toEqual(data);
        });

        it('should return empty array when no items have the path', () => {
            const data = [{ a: 1 }, { b: 2 }];

            const result = controller.filterByPropertyPath(data, 'z');

            expect(result).toEqual([]);
        });

        it('should return empty array when data is empty', () => {
            const result = controller.filterByPropertyPath([], 'path');

            expect(result).toEqual([]);
        });

        it('should support nested paths', () => {
            const data = [
                { user: { profile: { age: 25 } } },
                { user: { profile: {} } },
                { user: {} },
            ];

            const result = controller.filterByPropertyPath(data, 'user.profile.age');

            expect(result).toEqual([{ user: { profile: { age: 25 } } }]);
        });
    });
});

