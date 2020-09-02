import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'exportSelectedEntities'
})
export class ExportSelectedEntitiesPipe implements PipeTransform {

    public transform(types: any[], ...args: unknown[]): unknown {
        const selected = types ? types.filter(t => t.selected) : [];
        return selected;
    }

}
