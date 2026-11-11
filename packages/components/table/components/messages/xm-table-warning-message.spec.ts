import { TestBed } from '@angular/core/testing';
import { XM_DYNAMIC_COMPONENT_CONFIG, XmDynamicInstanceService } from '@xm-ngx/dynamic';
import { firstValueFrom, Observable, of } from 'rxjs';
import { XmTableWarningMessage } from './xm-table-warning-message';
import { XmTableWarningMessageConfig, XmTableWarningMessageControllerResult } from './xm-table-warning-message.model';

describe('XmTableWarningMessage', () => {
    let controllerResult: Observable<XmTableWarningMessageControllerResult>;

    const config: XmTableWarningMessageConfig = {
        controller: { key: 'repository', method: 'getWarningMessage' },
        title: 'table.warning',
        params: { entity: 'items', limit: 10 },
    };

    const createComponent = (): XmTableWarningMessage => {
        const controller = { getWarningMessage: () => controllerResult };

        TestBed.configureTestingModule({
            imports: [XmTableWarningMessage],
            providers: [
                { provide: XM_DYNAMIC_COMPONENT_CONFIG, useValue: config },
                { provide: XmDynamicInstanceService, useValue: { getControllerByKey: () => controller } },
            ],
        });

        const component = TestBed.createComponent(XmTableWarningMessage).componentInstance;
        component.ngOnInit();
        return component;
    };

    it('should support legacy boolean result with static params', async () => {
        controllerResult = of(true);
        const component = createComponent();

        expect(await firstValueFrom(component.state$)).toEqual({
            show: true,
            params: { entity: 'items', limit: 10 },
        });
    });

    it('should merge dynamic params from controller over static params', async () => {
        controllerResult = of({ show: true, params: { limit: 500 }, title: 'table.custom' });
        const component = createComponent();

        expect(await firstValueFrom(component.state$)).toEqual({
            show: true,
            title: 'table.custom',
            params: { entity: 'items', limit: 500 },
        });
    });

    it('should hide when controller method does not return observable', async () => {
        controllerResult = undefined;
        const component = createComponent();

        expect((await firstValueFrom(component.state$)).show).toBeFalse();
    });

    describe('interpolate', () => {
        let component: XmTableWarningMessage;

        beforeEach(() => {
            controllerResult = of(false);
            component = createComponent();
        });

        it('should replace placeholders with params', () => {
            expect(component.interpolate('Only {{ maxRecordCount }} of {{entity}} shown', { maxRecordCount: 500, entity: 'items' }))
                .toBe('Only 500 of items shown');
        });

        it('should support nested param keys', () => {
            expect(component.interpolate('Limit {{limit.max}}', { limit: { max: 10 } })).toBe('Limit 10');
        });

        it('should keep unresolved placeholders', () => {
            expect(component.interpolate('Only {{maxRecordCount}} shown', { maxRecordCount: null }))
                .toBe('Only {{maxRecordCount}} shown');
        });

        it('should return text as is without params', () => {
            expect(component.interpolate('Only {{maxRecordCount}} shown')).toBe('Only {{maxRecordCount}} shown');
        });
    });
});
