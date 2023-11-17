import { Component } from '@angular/core';
import { FlexLayoutSectionComponent } from '@ajsf/material';

@Component({
    selector: 'xm-flex-layout-section-widget',
    template: `
        <ng-container [ngSwitch]="containerType">
            <ng-container *ngSwitchCase="'div'">
                <div [class]="options?.htmlClass || ''"
                     [class.expandable]="options?.expandable && !expanded"
                     [class.expanded]="options?.expandable && expanded">

                    <label *ngIf="sectionTitle"
                           [class]="'legend ' + (options?.labelHtmlClass || '')"
                           [innerHTML]="sectionTitle"
                           (click)="toggleExpanded()"></label>

                    <ng-container *ngTemplateOutlet="layoutRootTpl"></ng-container>

                    <mat-error *ngIf="options?.showErrors && options?.errorMessage" [innerHTML]="options?.errorMessage"></mat-error>
                </div>
            </ng-container>

            <ng-container *ngSwitchCase="'fieldset'">
                <fieldset [class]="options?.htmlClass || ''"
                          [class.expandable]="options?.expandable && !expanded"
                          [class.expanded]="options?.expandable && expanded"
                          [disabled]="options?.readonly">

                    <legend *ngIf="sectionTitle"
                            [class]="'legend ' + (options?.labelHtmlClass || '')"
                            [innerHTML]="sectionTitle"
                            (click)="toggleExpanded()"></legend>

                    <ng-container *ngTemplateOutlet="layoutRootTpl"></ng-container>

                    <mat-error *ngIf="options?.showErrors && options?.errorMessage"
                               [innerHTML]="options?.errorMessage"></mat-error>
                </fieldset>
            </ng-container>

            <ng-container *ngSwitchCase="'card'">
                <mat-card [ngClass]="options?.htmlClass || ''"
                          [class.expandable]="options?.expandable && !expanded"
                          [class.expanded]="options?.expandable && expanded">
                    <mat-card-header *ngIf="sectionTitle">
                        <legend
                            [class]="'legend ' + (options?.labelHtmlClass || '')"
                            [innerHTML]="sectionTitle"
                            (click)="toggleExpanded()"></legend>
                    </mat-card-header>
                    <mat-card-content *ngIf="expanded">
                        <fieldset [disabled]="options?.readonly">
                            <ng-container *ngTemplateOutlet="layoutRootTpl"></ng-container>
                        </fieldset>
                    </mat-card-content>
                    <mat-card-footer>
                        <mat-error *ngIf="options?.showErrors && options?.errorMessage"
                                   [innerHTML]="options?.errorMessage"></mat-error>
                    </mat-card-footer>
                </mat-card>
            </ng-container>

            <ng-container *ngSwitchCase="'expansion-panel'">
                <mat-expansion-panel [expanded]="expanded"
                                     [hideToggle]="!options?.expandable">
                    <mat-expansion-panel-header>
                        <mat-panel-title>
                            <legend *ngIf="sectionTitle"
                                    [class]="options?.labelHtmlClass"
                                    [innerHTML]="sectionTitle"
                                    (click)="toggleExpanded()"></legend>
                        </mat-panel-title>
                    </mat-expansion-panel-header>

                    <fieldset [disabled]="options?.readonly">
                        <ng-container *ngTemplateOutlet="layoutRootTpl"></ng-container>
                    </fieldset>

                    <mat-error *ngIf="options?.showErrors && options?.errorMessage" [innerHTML]="options?.errorMessage"></mat-error>
                </mat-expansion-panel>
            </ng-container>
        </ng-container>

        <ng-template #layoutRootTpl>
            <xm-flex-layout-root-widget *ngIf="expanded"
                                        [layout]="layoutNode.items"
                                        [dataIndex]="dataIndex"
                                        [layoutIndex]="layoutIndex"
                                        [parentOptions]="computeOptions"
                                        [isFlexItem]="getFlexAttribute('is-flex')"
                                        [class.form-flex-column]="getFlexAttribute('flex-direction') === 'column'"
                                        [class.form-flex-row]="getFlexAttribute('flex-direction') === 'row'"
                                        [style.display]="getFlexAttribute('display')"
                                        [style.flex-direction]="getFlexAttribute('flex-direction')"
                                        [style.flex-wrap]="getFlexAttribute('flex-wrap')"
                                        [style.justify-content]="getFlexAttribute('justify-content')"
                                        [style.align-items]="getFlexAttribute('align-items')"
                                        [style.align-content]="getFlexAttribute('align-content')"
                                        [fxLayout]="getFlexAttribute('layout')"
                                        [fxLayoutGap]="options?.fxLayoutGap"
                                        [fxLayoutAlign]="options?.fxLayoutAlign"
                                        [attr.fxFlexFill]="options?.fxLayoutAlign"></xm-flex-layout-root-widget>
        </ng-template>
    `,
    styles: [`
        fieldset { border: 0; margin: 0; padding: 0; }
        .legend { font-weight: bold; }
        .expandable > .legend:before { content: '▶'; padding-right: .3em; }
        .expanded > .legend:before { content: '▼'; padding-right: .2em; }
    `],
})
export class XmFlexLayoutSectionComponent extends FlexLayoutSectionComponent {
    get computeOptions(): Record<string, string> {
        const computeLayout = `${this.getFlexAttribute('flex-direction')} ${this.getFlexAttribute('flex-wrap')}`;

        return {
            ...(this.options),
            fxLayout: this.options.fxLayout ?? computeLayout,
        };
    }
}
