import { Injectable, NgModule, Pipe } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { TranslatePipe } from '../translate.pipe';

@Injectable()
@Pipe({ name: 'translate' })
/** @public */
export class MockTranslatePipe {
    public transform: (args: string) => Observable<string> = (arg) => of(arg);
}

/** @public */
export class MockTranslateService {
    public get: (i: string) => Observable<string> = (arg) => of(arg);
}

@NgModule({
    declarations: [MockTranslatePipe],
    exports: [
        MockTranslatePipe,
    ],
    providers: [
        { provide: TranslatePipe, useClass: MockTranslatePipe },
        { provide: TranslateService, useClass: MockTranslateService },
    ],
})
/** @public */
export class XmTranslationTestingModule {
}
