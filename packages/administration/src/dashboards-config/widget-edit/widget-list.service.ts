import { Inject, Injectable, Injector } from '@angular/core';
import { TranslationService } from '@xm-ngx/administration/translations/services/translation.service';
import { DYNAMIC_COMPONENTS, DynamicTenantLoaderService, IDynamicComponent } from '@xm-ngx/dynamic';
import * as _ from 'lodash';
import { from, Observable, Subject } from 'rxjs';

interface ExtendedDynamicComponents extends IDynamicComponent {
    globalSelector: string;
}

function provideFullSelector(components: IDynamicComponent[], prefix?: string): ExtendedDynamicComponents[] {
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
        private translationService: TranslationService,
        private loader: DynamicTenantLoaderService,
        private injector: Injector,
        @Inject(DYNAMIC_COMPONENTS) private dynamiccomponents: ExtendedDynamicComponents[],
    ) {
        this.load();
    }

    public load(): void {
        const globalWithGlobalSelector = provideFullSelector(_.flatMap(this.dynamiccomponents));
        this.translationService.loadConfig().subscribe((config) => {
            const moduleSelectors = config.exts.map(i => `ext-${i.substring(0, i.indexOf('-ext'))}`);
            const moduleLoaders = moduleSelectors.map((ext) => this.loader.loadTenantModuleRef(ext, this.injector));
            from(Promise.all(moduleLoaders)).subscribe((modules) => {
                const components = modules.map(i => _.flatMap(i.injector.get(DYNAMIC_COMPONENTS, [])));
                const componentsWithGlobalSelector = components.map((i, ix) => provideFullSelector(i, moduleSelectors[ix]));
                const allComponents = _.uniq(_.flatMap([...componentsWithGlobalSelector, globalWithGlobalSelector]));
                this.widgets.next(allComponents);
            });
        });
    }
}
