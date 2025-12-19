import { TestBed } from '@angular/core/testing';
import { AXmTableLocalPageableCollectionController } from './a-xm-table-local-pageable-collection-controller.service';
import { XmFilterQueryParams } from './i-xm-table-collection-controller';
import { Injectable } from '@angular/core';

@Injectable()
class MockAXmTableLocalPageableCollectionController extends AXmTableLocalPageableCollectionController<any> {
    public override load(): void {
        // empty
    }

    public save(): void {
        // empty
    }
}

describe('AXmTableLocalPageableCollectionController', () => {
    let service: AXmTableLocalPageableCollectionController<any>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MockAXmTableLocalPageableCollectionController],
        });
        service = TestBed.inject(MockAXmTableLocalPageableCollectionController);
    });

    describe('changeByItems', () => {

        it('should handle no data', () => {
            const rawData: number[] = [];
            const request: XmFilterQueryParams = {
                pageableAndSortable: {
                    pageSize: 5,
                    pageIndex: 0,
                },
                filterParams: {},
            };

            service.changeByItems(rawData, request);
            const state = service['_state'].value;
            expect(state.items.length).toBe(0);
            expect(state.pageableAndSortable.total).toBe(0);
            expect(state.pageableAndSortable.pageIndex).toBe(0);
            expect(state.pageableAndSortable.pageSize).toBe(5);
        });

        it('should handle pagination at data boundaries', () => {
            const rawData = [1, 2, 3, 4, 5];
            const request: XmFilterQueryParams = {
                pageableAndSortable: {
                    pageSize: 5,
                    pageIndex: 1,
                },
                filterParams: {},
            };

            service.changeByItems(rawData, request);
            const state = service['_state'].value;
            expect(state.items.length).toBe(5);
            expect(state.pageableAndSortable.total).toBe(5);
            expect(state.pageableAndSortable.pageIndex).toBe(0);
            expect(state.pageableAndSortable.pageSize).toBe(5);
        });

        it('should paginate sorted data correctly', () => {
            const rawData = [{id: 3}, {id: 1}, {id: 4}, {id: 2}, {id: 5}];
            const request: XmFilterQueryParams = {
                pageableAndSortable: {
                    pageSize: 2,
                    pageIndex: 1,
                    sortBy: 'id',
                    sortOrder: 'asc',
                },
                filterParams: {},
            };

            service.changeByItems(rawData, request);
            const state = service['_state'].value;
            expect(state.items.length).toBe(2);
            expect(state.items).toEqual([{id: 3}, {id: 4}]);

            // Ensure pagination properties are correct
            expect(state.pageableAndSortable.pageIndex).toBe(1);
            expect(state.pageableAndSortable.pageSize).toBe(2);
            expect(state.pageableAndSortable.total).toBe(5);
        });

        it('should paginate data correctly with default page size and page index', () => {
            const rawData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            const request: XmFilterQueryParams = {
                pageableAndSortable: {
                    pageSize: 5,
                    pageIndex: 0,
                },
                filterParams: {},
            };

            service.changeByItems(rawData, request);
            const state = service['_state'].value;
            expect(state.items.length).toBe(5);
            expect(state.pageableAndSortable.total).toBe(10);
            expect(state.pageableAndSortable.pageIndex).toBe(0);
            expect(state.pageableAndSortable.pageSize).toBe(5);
        });

        it('should handle page index exceeding the maximum', () => {
            const rawData = [1, 2, 3, 4, 5];
            const request: XmFilterQueryParams = {
                pageableAndSortable: {
                    pageSize: 5,
                    pageIndex: 10, // This is intentionally set to an invalid index.
                },
                filterParams: {},
            };

            service.changeByItems(rawData, request);
            const state = service['_state'].value;
            expect(state.items.length).toBe(5);
            expect(state.pageableAndSortable.total).toBe(5);
            expect(state.pageableAndSortable.pageIndex).toBe(0);
            expect(state.pageableAndSortable.pageSize).toBe(5);
        });

        it('should paginate data with custom page size', () => {
            const rawData = [1, 2, 3, 4, 5];
            const request: XmFilterQueryParams = {
                pageableAndSortable: {
                    pageSize: 3,
                    pageIndex: 1,
                },
                filterParams: {},
            };

            service.changeByItems(rawData, request);
            const state = service['_state'].value;
            expect(state.items.length).toBe(2);
            expect(state.pageableAndSortable.total).toBe(5);
            expect(state.pageableAndSortable.pageIndex).toBe(1);
            expect(state.pageableAndSortable.pageSize).toBe(3);
        });

    });
});
