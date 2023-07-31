import { Component, Injectable, OnInit } from '@angular/core';
import { XM_DYNAMIC_ENTRIES, XmDynamicComponentRegistry } from '@xm-ngx/dynamic';
import { XmDynamicServiceFactory } from '../../xm-dynamic-service-factory.service';

@Injectable()
abstract class AMyFavoriteService {
    public abstract hello(): void;
}

@Injectable()
class MyFavoriteService extends AMyFavoriteService {
    public hello(): void {
        console.info('hello');
    }
}

@Component({
    selector: 'xm-dynamic-service-example',
    template: '',
    providers: [
        {
            provide: XM_DYNAMIC_ENTRIES,
            useValue: [{ selector: 'my-favorite-service', loadChildren: () => MyFavoriteService }],
        },
        XmDynamicComponentRegistry,
        XmDynamicServiceFactory,
    ],
    standalone: true,
})
export class XmDynamicServiceExampleComponent implements OnInit {
    constructor(
        private xmDynamicService: XmDynamicServiceFactory,
    ) {
    }

    public async ngOnInit(): Promise<void> {
        const service = await this.xmDynamicService.findAndFactory<AMyFavoriteService>('my-favorite-service');
        service.hello();
    }
}

