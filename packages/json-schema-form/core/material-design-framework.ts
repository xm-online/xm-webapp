import { Injectable } from '@angular/core';
import { MaterialDesignFramework } from '@ajsf/material';
import { XmFlexLayoutSectionComponent } from '../components/flex-layout-section.component';
import { XmFlexLayoutRootComponent } from '../components/flex-layout-root.component';
import { XmMaterialDesignFrameworkComponent } from '../components/material-design-framework.component';
import { XmMaterialAddReferenceComponent } from '../components/xm-material-add-reference.component';

@Injectable()
export class XmMaterialDesignFramework extends MaterialDesignFramework {
    constructor() {
        super();

        this.framework = XmMaterialDesignFrameworkComponent;
        this.widgets = {
            ...this.widgets,
            root: XmFlexLayoutRootComponent,
            section: XmFlexLayoutSectionComponent,
            $ref: XmMaterialAddReferenceComponent,
        };
    }
}
