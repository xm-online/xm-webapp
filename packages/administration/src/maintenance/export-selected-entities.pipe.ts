import { Pipe, PipeTransform } from '@angular/core';
import { ExportConfig } from '@xm-ngx/administration/maintenance/export-entities-details/export-entities-details.component';

@Pipe({
    name: 'exportSelectedEntities',
})
export class ExportSelectedEntitiesPipe implements PipeTransform {

    public transform(types: ExportConfig[], ...args: unknown[]): unknown {
        return types ? types.filter(t => t.selected) : [];
    }

}
