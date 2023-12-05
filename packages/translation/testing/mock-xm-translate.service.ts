import { Injectable } from '@angular/core';

@Injectable()
/** @public */
export class MockXmTranslateService {
    public translate: (i: string) => string = (arg) => arg;
    public interpolate: (i: string) => string = (arg) => arg;

    public locale: string = '';
}
