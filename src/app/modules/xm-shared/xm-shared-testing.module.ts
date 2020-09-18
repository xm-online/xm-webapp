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
export class TranslatePipeMock {
    public transform: (args: string) => Observable<string> = (arg) => of(arg);
}

export class TranslateServiceMock {
    public get: (i: string) => Observable<string> = (arg) => of(arg);
}

@NgModule({
    declarations: [TranslatePipeMock],
    imports: [
        XmSharedModule,
        HttpClientTestingModule,
        RouterTestingModule,
    ],
    exports: [
        XmSharedModule,
        HttpClientTestingModule,
        RouterTestingModule,
        TranslatePipeMock,
    ],
    providers: [
        { provide: TranslatePipe, useValue: TranslatePipeMock },
        { provide: TranslateService, useClass: TranslateServiceMock },
        { provide: MatDialogRef, useValue: {} },
    ],
})
export class XmSharedTestingModule {
}
