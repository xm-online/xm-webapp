import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { IXmTableCollectionController } from '@xm-ngx/components/table';
import { injectByKey, XM_DYNAMIC_TABLE_ROW } from '@xm-ngx/dynamic';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';

@Component({
    standalone: true,
    selector: 'clone-entity-action',
    template: `
        <div class="mat-mdc-menu-item" (click)="clone()" *ngIf="config">
            {{config.title | translate}}
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        MatFormFieldModule,
        XmTranslationModule,
        ControlErrorModule,
        MatButtonModule,
        MatIconModule,
    ],
})
export class CloneActionComponent {
    @Input() public config: {
        title: Translate,
    };

    private collectionController = injectByKey<IXmTableCollectionController<unknown>>('collection');
    protected item = inject(XM_DYNAMIC_TABLE_ROW, {optional: true});

    public clone(): void {
        this.collectionController.add(this.item);
        this.collectionController.save();
    }
}
