import { inject, Injectable, Injector, StaticProvider } from '@angular/core';
import { XmDynamicServiceFactory } from '../../services/xm-dynamic-service-factory.service';
import { XmDynamicControllerDeclaration } from '../../presentation/xm-dynamic-presentation-base.directive';
import { XmDynamicInjectionTokenStoreService } from './xm-dynamic-injection-token-store.service';


@Injectable()
export class XmDynamicControllerInjectorFactoryService {

    private dynamicInjectionTokenStore = inject(XmDynamicInjectionTokenStoreService);
    private dynamicServices = inject(XmDynamicServiceFactory);

    public async defineProviders(controllers: XmDynamicControllerDeclaration[], providers: StaticProvider[], parentInjector: Injector): Promise<Injector> {
        if (controllers?.length > 0) {
            for (const controller of controllers) {
                providers.push(await this.createControllerProvider(controller, parentInjector));
            }
        }

        const injector = Injector.create({
            providers,
            parent: parentInjector,
        });

        if (controllers?.length > 0) {
            controllers.forEach(controller => {
                this.enrichControllerData(controller, injector);
            });
        }

        return injector;
    }

    private async createControllerProvider(controller: XmDynamicControllerDeclaration, parentInjector: Injector): Promise<StaticProvider> {
        const entry = {
            classType: await this.dynamicServices.find(controller.selector, parentInjector),
            config: controller.config,
            key: controller.key,
        };

        const token = this.dynamicInjectionTokenStore.resolve(entry.key);
        return {provide: token, useClass: entry.classType, deps: []};
    }

    private enrichControllerData(controller: XmDynamicControllerDeclaration, injector: Injector): any {
        const token = this.dynamicInjectionTokenStore.resolve(controller.key);
        const instance = injector.get(token);
        instance.config = controller.config;
    }
}
