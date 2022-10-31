import { Inject, Injectable, Injector } from '@angular/core';
import {
    DynamicModulesService,
    XM_DYNAMIC_ENTRIES,
    XM_DYNAMIC_EXTENSIONS,
    XmDynamicEntry,
    XmDynamicExtensionEntry,
} from '@xm-ngx/dynamic';
import * as _ from 'lodash';
import { uniq } from 'lodash';
import { Observable, Subject } from 'rxjs';

export interface ExtendedDynamicComponents extends XmDynamicEntry {
    globalSelector: string;
}

function provideFullSelector(components: XmDynamicEntry[], prefix?: string): ExtendedDynamicComponents[] {
    const append = prefix ? `${prefix}/` : '';
    return components.map((i) => {
        const globalSelector = `${append}${i.selector}`;
        return {...i, globalSelector};
    });
}

@Injectable()
export class WidgetListService {

    public widgets: Subject<ExtendedDynamicComponents[]> = new Subject<ExtendedDynamicComponents[]>();
    public widgets$: Observable<ExtendedDynamicComponents[]> = this.widgets.asObservable();

    constructor(
        @Inject(XM_DYNAMIC_EXTENSIONS) private dynamicExtensions: XmDynamicExtensionEntry[],
        @Inject(XM_DYNAMIC_ENTRIES) private dynamicEntries: XmDynamicEntry[],
        private dynamicModules: DynamicModulesService,
        private injector: Injector,
    ) {
    }

    public load(): void {
        const globalEntries = this.dynamicEntries || [];
        const moduleSelectors = Object.keys(this.dynamicExtensions[0]);
        const uniqModuleSelectors = uniq(moduleSelectors.map(v => v.startsWith('ext-') ? v.slice(4, v.length) : v))
        const moduleLoaders = uniqModuleSelectors.map((ext) => {
            const module = this.dynamicModules.find(ext, this.injector);
            if (module) {
                if (module instanceof Promise) {
                    return module.then(entry => entry ? {
                        injector: entry.injector,
                        selector: ext
                    } : null)
                }
                return {
                    injector: (module as any).injector,
                    selector: ext
                }
            }
            return null;
        }).filter(Boolean);
        // Please, avoid by all ways using SUBSCRIBE inside service which cannot guarantee 100% destroy of unused observable instance.
        // Return observable instead, make function not side effect but a part of sequence.
        Promise.all(moduleLoaders).then(modules => {
            const extComponents = modules.filter(Boolean).map(module => {
                const components = module.injector.get(XM_DYNAMIC_ENTRIES, []);
                return components.map(componentRegistry => provideFullSelector(Object.values(componentRegistry['any']), module.selector))
            });
            const globalComponents = globalEntries.map(entry => provideFullSelector(Object.values(entry['any'])));
            const allComponents = _.uniq(_.flatMap([...extComponents, ...globalComponents]));
            const widgets = Object.values(_.flatMap(allComponents).reduce((acc, v) => {
                acc[v.globalSelector] = v;
                return acc
            }, {})) as any;
            this.widgets.next(widgets);
        })
    }
}
