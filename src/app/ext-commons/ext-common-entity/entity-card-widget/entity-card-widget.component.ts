import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';
import { map, tap } from 'rxjs/operators';
import { Principal } from '../../../shared';
import { buildJsfAttributes, nullSafe } from '../../../shared/jsf-extention';
import { XmEntity, XmEntityService, XmEntitySpec, Spec } from '../../../xm-entity';
// import * as _ from 'lodash';

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

    // isEdit = true;
    // formCtrl = new FormControl;
    // formCopy;
    // xmEntity$: Observable<XmEntity>;

    public jsfAttributes: any;
    public showLoader: boolean;

    constructor(private xmEntityService: XmEntityService,
                private sessionStorage: SessionStorageService,
                public principal: Principal) {
    }

    public ngOnInit(): void {
        this.loadEntity();
    }

    public getCurrentStateSpec() {
        return this.xmEntitySpec.states &&
            this.xmEntitySpec.states.filter((s) => s.key === this.xmEntity.stateKey).shift();
    }

    private loadEntity(): void {
        const xmEntityId = this.sessionStorage.retrieve('widget:data');
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
                        // _.each(this.jsfAttributes.form.shift(), function(item) {
                        //     console.log(item);
                        //     _.each
                        // });
                        this.jsfAttributes.data = Object.assign(
                            nullSafe(this.jsfAttributes.data),
                            nullSafe(this.xmEntity.data));
                    }
                }),
            ).subscribe();

    }

    // private processForms(dataForm) {
    //     const form: Array<any> = JSON.parse(dataForm).conditionalForms;
    //     this.formCopy = Object.assign(form);

        // this.formCopy.forEach(f => {
        //     f.form = this.makeFormReadonly(f.form);
        //
        // });

        // _.each(this.formCopy, f => f.form = this.makeFormReadonly(f.form));

        // console.log('Form result --- ', this.formCopy);
        // const bufForm = JSON.parse(this.xmEntitySpec.dataForm);
        // bufForm.conditionalForms = this.formCopy;
        //
        // this.xmEntitySpec.dataForm = JSON.stringify(bufForm);
    // }

    // private makeFormReadonly(fields: []) {
    //     if (fields && fields.length) {
    //         fields.forEach((f: any) => {
    //             if (f.key) {
    //                f.disabled = true;
    //                return fields;
    //             } else
    //                 this.makeFormReadonly(f.items || f.tabs)
    //         })
    //     }
    // }

    private getXmEntitySpec(typeKey: string): XmEntitySpec {
        const vTypeKey = typeKey ? typeKey : this.xmEntity.typeKey;
        return this.spec.types.filter((t) => t.key === vTypeKey).shift();
    }

    public getEntityField(field: any): any {
        if (this.xmEntity) {
            return this.xmEntity.data[field] || '';
        }
    }

    // public onEdit(entity: XmEntity, entitySpec: XmEntitySpec) {
    //     console.log(entity,'SPEC', entitySpec);
    //     const modalRef = this.modalService.open(EntityDetailDialogComponent, {backdrop: 'static', size: 'lg'});
    //     modalRef.componentInstance.xmEntity = entity;
    //     modalRef.componentInstance.xmEntitySpec = entitySpec;
    //     modalRef.componentInstance.spec = this.spec;
    //     return modalRef;
    // }
}
