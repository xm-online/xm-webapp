import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MaterialAddReferenceComponent } from '@ajsf/material';
import { MatButtonModule } from '@angular/material/button';
import { NgClass, NgIf } from '@angular/common';
import { XmTranslateService } from '@xm-ngx/translation';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'material-add-reference-widget',
    standalone: true,
    template: `
    <section [ngClass]="options?.htmlClass ?? ''" align="end">
      <button mat-raised-button *ngIf="showAddButton"
        [color]="options?.color || 'accent'"
        [disabled]="options?.readonly"
        (click)="addItem($event)">
        <span *ngIf="options?.icon" [ngClass]="options?.icon ?? ''"></span>
        <span *ngIf="options?.title" [innerHTML]="modifiedButtonTitle"></span>
      </button>
    </section>`,
    imports: [NgIf, NgClass, MatButtonModule],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmMaterialAddReferenceComponent extends MaterialAddReferenceComponent implements OnInit{

    private translateService = inject(XmTranslateService);
    public modifiedButtonTitle: string;

    public ngOnInit() {
        super.ngOnInit();
        this.modifiedButtonTitle = this.buttonText.replace('Add to', this.translateService.translate('global.common.add-to'));
    }

}
