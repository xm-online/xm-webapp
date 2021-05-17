import {
    Component,
    EventEmitter,
    Injector,
    Input,
    NgModuleFactoryLoader,
    OnInit,
    Output,
    ViewContainerRef
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { JhiEventManager } from 'ng-jhipster';
import { finalize } from 'rxjs/operators';

import { Principal } from '../../shared/auth/principal.service';
import { buildJsfAttributes, nullSafe } from '../../shared/jsf-extention/jsf-attributes-helper';
import { XmEntitySpec } from '../shared/xm-entity-spec.model';
import { XmEntity } from '../shared/xm-entity.model';
import { XmEntityService } from '../shared/xm-entity.service';
import { WidgetLibraryService } from 'angular2-json-schema-form';
// import { JsfTestComponent } from './jsf-test/jsf-test.component';
import { from as fromPromise } from 'rxjs';

declare let swal: any;

@Component({
    selector: 'xm-entity-data-card',
    templateUrl: './entity-data-card.component.html',
    styleUrls: ['./entity-data-card.component.scss'],
})
export class EntityDataCardComponent implements OnInit {

    @Input() public xmEntity: XmEntity;
    @Input() public xmEntitySpec: XmEntitySpec;
    @Input() public preventDefaultUpdateError?: boolean;
    @Output() public onSaveError: EventEmitter<boolean> = new EventEmitter<boolean>();

    public jsfAttributes: any;
    public showLoader: boolean;

    public ready: boolean;

    constructor(private xmEntityService: XmEntityService,
                private translateService: TranslateService,
                private eventManager: JhiEventManager,
                // private ws: WidgetLibraryService,
                public principal: Principal,


                private viewRef: ViewContainerRef,
                private widgetLibrary: WidgetLibraryService,
                private loader: NgModuleFactoryLoader,
                private injector: Injector,
    ) {
        // this.ws.registerWidget('jsf-rs-input1', JsfTestComponent);
        // console.warn(JsfTestComponent);

        const moduleFactory = fromPromise(this.loader.load('src/app/ext/research-webapp-ext/module/research-webapp-ext-jsf.module#ResearchWebappExtJsfModule'));
        moduleFactory.subscribe((factory) => {
            const module = factory.create(this.injector);
            const entryComponentType = module.injector.get('jsf-rs-input');
            const componentFactory = module.componentFactoryResolver.resolveComponentFactory(entryComponentType);
            const widget: any = this.viewRef.createComponent(componentFactory);
            this.widgetLibrary.registerWidget('jsf-rs-input', widget);
            this.ready = true;
        });
    }

    public ngOnInit(): void {
        this.load();
    }

    public onSubmitForm(data: any): void {
        this.showLoader = true;
        this.xmEntity.data = Object.assign({}, data);
        this.xmEntityService.update(this.xmEntity).pipe(finalize(() => this.showLoader = false))
            .subscribe(
                (res) => {
                    this.eventManager.broadcast({name: 'xmEntityDetailModification', content: {entity: res.body}});
                    this.xmEntity = Object.assign(this.xmEntity, res.body);
                    this.alert('success', 'xm-entity.entity-data-card.update-success');
                },
                (err) => {
                    if (!this.preventDefaultUpdateError) {
                        this.alert('error', 'xm-entity.entity-data-card.update-error');
                    } else {
                        this.onSaveError.emit(err);
                    }
                },
            );
    }

    private load(): void {
        if (this.xmEntitySpec && this.xmEntitySpec.dataSpec) {
            this.jsfAttributes = buildJsfAttributes(this.xmEntitySpec.dataSpec, this.xmEntitySpec.dataForm);
            this.jsfAttributes.data = Object.assign(nullSafe(this.jsfAttributes.data), nullSafe(this.xmEntity.data));
        }
    }

    private alert(type: string, key: string): void {
        swal({
            type,
            text: this.translateService.instant(key),
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-primary',
        });
    }

}
