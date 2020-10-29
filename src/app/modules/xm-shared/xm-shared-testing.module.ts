import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Injectable, NgModule, Pipe } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateService } from '@ngx-translate/core';
import { TranslatePipe } from '@xm-ngx/translation';
import { Observable, of } from 'rxjs';

import { XmSharedModule } from './xm-shared.module';

@Injectable()
@Pipe({ name: 'translate' })
export class MockTranslatePipe {
    public transform: (args: string) => Observable<string> = (arg) => of(arg);
}

export class MockTranslateService {
    public get: (i: string) => Observable<string> = (arg) => of(arg);
}

@NgModule({
    declarations: [MockTranslatePipe],
    imports: [
        XmSharedModule,
        HttpClientTestingModule,
        RouterTestingModule,
    ],
    exports: [
        XmSharedModule,
        HttpClientTestingModule,
        RouterTestingModule,
        MockTranslatePipe,
    ],
    providers: [
        { provide: TranslatePipe, useClass: MockTranslatePipe },
        { provide: TranslateService, useClass: MockTranslateService },
        { provide: MatDialogRef, useValue: {} },
    ],
})
export class XmSharedTestingModule {
}
