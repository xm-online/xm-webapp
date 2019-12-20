import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { JhiEventManager } from 'ng-jhipster';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Principal } from '../../../shared';
import { buildJsfAttributes, nullSafe } from '../../../shared/jsf-extention';
import { XmEntity, XmEntityService, XmEntitySpec, Spec } from '../../../xm-entity';
import { DEBUG_INFO_ENABLED } from '../../../xm.constants';

@Component({
    selector: 'xm-entity-card-widget',
    templateUrl: './entity-card-widget.component.html',
    styleUrls: ['./entity-card-widget.component.scss']
})
export class EntityCardWidgetComponent implements OnInit {

    public config: any;
    public xmEntity: XmEntity;
    public xmEntitySpec: XmEntitySpec;
    public spec: Spec;

    xmEntity$: Observable<XmEntity>;

    jsfAttributes: any;
    showLoader: boolean;

    constructor(private xmEntityService: XmEntityService,
                private translateService: TranslateService,
                private eventManager: JhiEventManager,
                public principal: Principal) {
    }

    public ngOnInit(): void {
        this.loadEntity();
        console.log(this);
    }

    public onSubmitForm(): void {}

    getCurrentStateSpec() {
        return this.xmEntitySpec.states &&
            this.xmEntitySpec.states.filter((s) => s.key === this.xmEntity.stateKey).shift();
    }

    private loadEntity(): void {
        // const xmEntityId = this.config.xmEntityId ? this.config.xmEntityId : this.contextService.get('xmEntityId');
        const xmEntityId = 15475;
        if (!xmEntityId) { return; }

        this.xmEntityService.find(xmEntityId, {'embed': 'data'})
            .pipe(
                map((response) => response.body),
                tap((entity) => this.xmEntity = entity),
                tap((entity) => this.xmEntitySpec = this.getXmEntitySpec(entity.typeKey)),
                tap( () => this.xmEntitySpec.dataForm =
                    this.config.dataForm ? this.config.dataForm : this.xmEntitySpec.dataForm),
                tap( () => {
                    if (this.xmEntitySpec && this.xmEntitySpec.dataSpec) {
                        this.jsfAttributes = buildJsfAttributes(this.xmEntitySpec.dataSpec, this.xmEntitySpec.dataForm);
                        this.jsfAttributes.data = Object.assign(
                            nullSafe(this.jsfAttributes.data),
                            nullSafe(this.xmEntity.data));
                    }
                }),
            ).subscribe();

    }

    private getXmEntitySpec(typeKey: string): XmEntitySpec {
        const vTypeKey = typeKey ? typeKey : this.xmEntity.typeKey;
        return this.spec.types.filter((t) => t.key === vTypeKey).shift();
    }
}
