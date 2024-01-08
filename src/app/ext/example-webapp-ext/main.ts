import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {enableProdMode} from '@angular/core';

enableProdMode();

import {Component} from '@angular/core';

@Component({
    selector: 'example-app',
    standalone: true,
    template: 'Example webapp ext',
})
export class NameComponent {
}

platformBrowserDynamic().bootstrapModule(NameComponent)
    .catch(err => console.error(err));

export * from './index';
