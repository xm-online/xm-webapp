import { Component } from '@angular/core';
import { MaterialDesignFrameworkComponent } from '@ajsf/material';

@Component({
    selector: 'xm-material-design-framework',
    template: `
       <div
          [class.array-item]="widgetLayoutNode?.arrayItem && widgetLayoutNode?.type !== '$ref'"
          [orderable]="false"
          [dataIndex]="dataIndex"
          [layoutIndex]="layoutIndex"
          [layoutNode]="widgetLayoutNode">
          <svg *ngIf="showRemoveButton"
               xmlns="http://www.w3.org/2000/svg"
               height="18" width="18" viewBox="0 0 24 24"
               class="close-button"
               (click)="removeItem()">
            <path
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
          </svg>

          <select-widget-widget
            [dataIndex]="dataIndex"
            [layoutIndex]="layoutIndex"
            [layoutNode]="widgetLayoutNode"></select-widget-widget>
        </div>

        <div class="spacer" *ngIf="widgetLayoutNode?.arrayItem && widgetLayoutNode?.type !== '$ref'"></div>
    `,
    styles: [`
        .array-item {
            border-radius: 2px;
            box-shadow: 0 3px 1px -2px rgba(0, 0, 0, .2),
            0 2px 2px 0 rgba(0, 0, 0, .14),
            0 1px 5px 0 rgba(0, 0, 0, .12);
            padding: 6px;
            position: relative;
            transition: all 280ms cubic-bezier(.4, 0, .2, 1);
        }

        .close-button {
            cursor: pointer;
            position: absolute;
            top: 6px;
            right: 6px;
            fill: rgba(0, 0, 0, .4);
            visibility: hidden;
            z-index: 500;
        }

        .close-button:hover {
            fill: rgba(0, 0, 0, .8);
        }

        .array-item:hover > .close-button {
            visibility: visible;
        }

        .spacer {
            margin: 6px 0;
        }
    `],
})
export class XmMaterialDesignFrameworkComponent extends MaterialDesignFrameworkComponent {}
