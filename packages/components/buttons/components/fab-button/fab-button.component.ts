import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { AsyncPipe } from '@angular/common';
import { XmLoadingModule } from '@xm-ngx/components/loading';
import { MatIcon } from '@angular/material/icon';
import { XmTranslatePipe } from '@xm-ngx/translation';
import { ButtonBase } from '../button-base';
import { XmPermissionModule } from '@xm-ngx/core/permission';

/**
 * Use this component to create regular fab button.
 *
 * ## Usage
 * | Property | Key |
 * |---|---|
 * | selector |\@xm-ngx/components/fab-button |
 * | config | FabButtonConfigInterface |
 *
 * `FabButtonComponent` extends `ButtonBase` class
 * `ButtonBase` class manages controller handling as well as the disabled and loading states of a button
 * If you want to create your own button, you can inherit these logic by extending from `ButtonBase`
 *
 * ## Configuration `FabButtonConfigInterface`
 * FabButtonConfigInterface extends ButtonConfigInterface
 * | Key | Description | Type | Default Value |
 * |-----------------------------------------------|-------------|------|---------------|
 * | `title` (optional) | The text that is displayed on the button.<br> Title property can be not provided (for example if we have icon fab button) | `Translate` | `null` |
 * | `icon` (optional) | The icon key that is passed into the <mat-icon> tag | `string` | `null` |
 * | `tooltip` (optional) | The text that is displayed when hovering over the button | `string` | `null` |
 * | `class` (optional) | The class names separated by spaces that will be set on the button  | `string` | `null` |
 * | `style` (optional) | The inline style rules that will be applied to the button | `string` | `null` |
 * | `permissions` (optional) | An array of permissions that determines whether to display the button | `string[]` | `null` |
 * | `controller` (optional) | An object to specify which controller will handle the button click | `Controller` | `null` |
 * | `dataQa` (optional) | Specifies data-qa attribute for the element. | `'string'` | `'???'` |
 * | `extended` (optional) | Property to specify which type of fab button will be displayed | `boolean` | `false` |
 *
 * ## Configuration `Controller`
 * | Key | Description | Type |
 * | key | The key used to register your controller | `string` |
 * | method | The name of the method in the controller that will be executed when the button is clicked | string |
 * | config | The config that controller will use. | `any` or ButtonControllerBase |
 */

@Component({
    selector: 'xm-fab-button',
    standalone: true,
    imports: [MatButtonModule, MatTooltip, AsyncPipe, XmLoadingModule, MatIcon, XmTranslatePipe, XmPermissionModule],
    templateUrl: './fab-button.component.html',
    styleUrls: ['../../styles/button-general.scss', './fab-button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: 'xm-fab-button' },
})
export class FabButtonComponent extends ButtonBase {}
