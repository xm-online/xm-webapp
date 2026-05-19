import { inject, Injectable, Injector, StaticProvider } from '@angular/core';
import { XmDynamicServiceFactory } from '../../services/xm-dynamic-service-factory.service';
import { XmDynamicControllerDeclaration } from '../../presentation/xm-dynamic-presentation-base.directive';
import { XmDynamicInjectionTokenStoreService } from './xm-dynamic-injection-token-store.service';
import { XM_DYNAMIC_SERVICE_CONFIG } from '../dynamic.injectors';

@Injectable()
export class XmDynamicControllerInjectorFactoryService {
    private dynamicInjectionTokenStore = inject(XmDynamicInjectionTokenStoreService);
    private dynamicServices = inject(XmDynamicServiceFactory);

    public async defineProviders(
        controllers: XmDynamicControllerDeclaration[],
        providers: StaticProvider[],
        parentInjector: Injector,
    ): Promise<Injector> {
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
            controllers.forEach((controller) => {
                this.enrichControllerData(controller, injector);
            });
        }

        return injector;
    }

    private async createControllerProvider(
        controller: XmDynamicControllerDeclaration,
        parentInjector: Injector,
    ): Promise<StaticProvider> {
        const classType = await this.dynamicServices.find(controller.selector, parentInjector);
        const token = this.dynamicInjectionTokenStore.resolve(controller.key);
        const config = controller.config ?? null;

        return {
            provide: token,
            useFactory: (sharedInjector: Injector) => {
                const controllerInjector = Injector.create({
                    providers: [
                        { provide: classType, useClass: classType, deps: [] },
                        { provide: XM_DYNAMIC_SERVICE_CONFIG, useValue: config },
                    ],
                    parent: sharedInjector,
                });
                return controllerInjector.get(classType);
            },
            deps: [Injector],
        };
    }

    private enrichControllerData(
        controller: XmDynamicControllerDeclaration,
        injector: Injector,
    ): any {
        const token = this.dynamicInjectionTokenStore.resolve(controller.key);
        const instance = injector.get(token);
        instance.config = controller.config;
    }
}
