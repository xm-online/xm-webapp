import { Inject, Injectable } from '@angular/core';
import { XM_DYNAMIC_EXTENSIONS, XmDynamicExtensionEntry, } from './xm-dynamic-extension.injectors';
import { ArgumentException } from '@xm-ngx/shared/exceptions';
import * as _ from 'lodash';

@Injectable({providedIn: 'root'})
export class TenantModuleLoaderService {

    constructor(
        @Inject(XM_DYNAMIC_EXTENSIONS) private dynamicExtensions: XmDynamicExtensionEntry[],
    ) {
    }

    public getEntry<T>(selector: string): XmDynamicExtensionEntry<T> {
        const entry = _.find(_.flatMap(this.dynamicExtensions), i => i.selector == selector) as XmDynamicExtensionEntry<T>;
        if (entry == null) {
            throw new ArgumentException(`ModuleLoader The "${selector}" is not defined!`);
        }
        return entry;
    }
}
