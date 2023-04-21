import { Component, Injectable, Injector, OnInit, Type } from '@angular/core';
import { XM_DYNAMIC_ENTRIES, XmDynamicComponentRegistry } from '@xm-ngx/dynamic';

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

@Injectable()
class XmDynamicServiceFactory {
    constructor(private injector: Injector) {
    }

    public factory<T>(serviceConstructor: Type<T> | any): T {
        const injector = Injector.create({
            providers: [serviceConstructor],
            parent: this.injector,
        });
        return injector.get<T>(serviceConstructor);
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
        private xmDynamicComponentRegistry: XmDynamicComponentRegistry,
        private xmDynamicService: XmDynamicServiceFactory,
        private injector: Injector,
    ) {
    }

    public async ngOnInit(): Promise<void> {
        const serviceConstructor = await this.xmDynamicComponentRegistry.find<AMyFavoriteService>('my-favorite-service', this.injector);
        const service = this.xmDynamicService.factory<AMyFavoriteService>(serviceConstructor.componentType);
        service.hello();
    }
}

