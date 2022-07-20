import { Injectable } from '@angular/core';
import { MaterialDesignFramework } from '@ajsf/material';
import { XmFlexLayoutSectionComponent } from '@xm-ngx/json-schema-form/components/flex-layout-section.component';
import { XmFlexLayoutRootComponent } from '@xm-ngx/json-schema-form/components/flex-layout-root.component';
import { XmMaterialDesignFrameworkComponent } from '@xm-ngx/json-schema-form/components/material-design-framework.component';

@Injectable()
export class XmMaterialDesignFramework extends MaterialDesignFramework {
    constructor() {
        super();

        this.framework = XmMaterialDesignFrameworkComponent;
        this.widgets = {
            ...this.widgets,
            root: XmFlexLayoutRootComponent,
            section: XmFlexLayoutSectionComponent,
        };
    }
}
