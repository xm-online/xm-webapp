import { Pipe, PipeTransform } from '@angular/core';
import { Spec } from '@xm-ngx/core/entity';

@Pipe({name: 'xmEntityStateSpec', standalone: true})
export class XmEntityStateSpecPipe implements PipeTransform {

    public transform(value: string, specKey: string, spec: Spec): any {
        const entitySpec = spec.types.filter((x) => x.key === specKey).shift();
        const states = entitySpec.states;
        return states.filter((x) => x.key === value).shift();
    }
}
