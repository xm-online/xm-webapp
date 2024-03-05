import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
@Pipe({ name: 'xmTranslate',
    standalone: true,
})
/** @public */
export class MockXmTranslatePipe implements PipeTransform {
    public transform: (args: string) => Observable<string> = (arg) => of(arg);
}
