import { Inject, Injectable, Injector } from '@angular/core';
import {
    XM_DYNAMIC_ENTRIES,
    XM_DYNAMIC_EXTENSIONS,
    XmDynamicEntry,
    XmDynamicExtensionEntry,
    XmDynamicModuleRegistry,
} from '@xm-ngx/dynamic';
import * as _ from 'lodash';
import { Observable, ReplaySubject, Subject } from 'rxjs';

export interface ExtendedDynamicComponents extends XmDynamicEntry {
    globalSelector: string;
}

function provideFullSelector(components: XmDynamicEntry[], prefix?: string): ExtendedDynamicComponents[] {
    const append = prefix ? `${prefix}/` : '';
    return components.map((i) => {
        const globalSelector = `${append}${i.selector}`;
        return { ...i, globalSelector };
    });
}

@Injectable()
export class WidgetListService {

    private widgets: Subject<ExtendedDynamicComponents[]> = new ReplaySubject<ExtendedDynamicComponents[]>(1);
    public widgets$: Observable<ExtendedDynamicComponents[]> = this.widgets.asObservable();

    constructor(
        @Inject(XM_DYNAMIC_EXTENSIONS) private dynamicExtensions: XmDynamicExtensionEntry[],
        @Inject(XM_DYNAMIC_ENTRIES) private dynamicEntries: XmDynamicEntry[],
        private dynamicModules: XmDynamicModuleRegistry,
        private injector: Injector,
    ) {
    }

    public async load(): Promise<void> {
        const globalWithGlobalSelector = provideFullSelector(_.flatMap(this.dynamicEntries));
        const moduleSelectors = _.flatMap(this.dynamicExtensions).map(i => i.selector)
            // TODO:WORKAROUND: remove modules with ext-prefix. Remove after ext- prefix creation will be removed
            .filter(i => !i.startsWith('ext-'))
        ;
        const moduleLoaders = moduleSelectors.map((ext) => this.dynamicModules.find(ext, this.injector));
        const modules = await Promise.all(moduleLoaders);
        const components = modules.map(i => _.flatMap(i.injector.get(XM_DYNAMIC_ENTRIES, [])));
        const componentsWithGlobalSelector = components.map((i, ix) => provideFullSelector(i, moduleSelectors[ix]));
        const allComponents = _.uniq(_.flatMap([...componentsWithGlobalSelector, globalWithGlobalSelector]));
        this.widgets.next(allComponents);
    }
}
