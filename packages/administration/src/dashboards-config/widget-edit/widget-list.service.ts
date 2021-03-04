import { ApplicationRef, Injectable, Injector } from '@angular/core';
import { TranslationService } from '@xm-ngx/administration/translations/services/translation.service';
import { DYNAMIC_COMPONENTS, DynamicComponent, DynamicTenantLoaderService } from '@xm-ngx/dynamic';
import * as _ from 'lodash';
import { from, Observable, Subject } from 'rxjs';

export interface ExtendedDynamicComponents extends DynamicComponent {
    globalSelector: string;
}

function provideFullSelector(components: DynamicComponent[], prefix?: string): ExtendedDynamicComponents[] {
    const append = prefix ? `${prefix}/` : '';
    return components.map((i) => {
        const globalSelector = `${append}${i.selector}`;
        return { ...i, globalSelector };
    });
}

@Injectable()
export class WidgetListService {

    public widgets: Subject<ExtendedDynamicComponents[]> = new Subject<ExtendedDynamicComponents[]>();
    public widgets$: Observable<ExtendedDynamicComponents[]> = this.widgets.asObservable();

    constructor(
        private translationService: TranslationService,
        private loader: DynamicTenantLoaderService,
        private injector: Injector,
        private applicationRef: ApplicationRef,
    ) {
    }

    public loadWithConfig(config: { modules: string [] }): void {
        const globalWithGlobalSelector = provideFullSelector(_.flatMap(this.getRootDynamics()));

        const moduleSelectors = config.modules.map(i => `ext-${i.substring(0, i.indexOf('-ext'))}`);
        const moduleLoaders = moduleSelectors.map((ext) => this.loader.loadTenantModuleRef(ext, this.injector));
        from(Promise.all(moduleLoaders)).subscribe((modules) => {
            const components = modules.map(i => _.flatMap(i.injector.get(DYNAMIC_COMPONENTS, [])));
            const componentsWithGlobalSelector = components.map((i, ix) => provideFullSelector(i, moduleSelectors[ix]));
            const allComponents = _.uniq(_.flatMap([...componentsWithGlobalSelector, globalWithGlobalSelector]));
            this.widgets.next(allComponents);
        });
    }

    public load(): void {
        this.translationService.loadConfig().subscribe((config) => {
            this.loadWithConfig({ modules: config?.exts || [] });
        });
    }

    public getRootDynamics(): ExtendedDynamicComponents[] {
        return this.applicationRef['_injector'].get(DYNAMIC_COMPONENTS);
    }
}
