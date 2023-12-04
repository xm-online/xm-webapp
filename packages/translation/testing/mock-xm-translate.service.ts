/** @public */
import { Injectable } from '@angular/core';

@Injectable()
export class MockXmTranslateService {
    public translate: (i: string) => string = (arg) => arg;
    public interpolate: (i: string) => string = (arg) => arg;

    public locale: string = '';
}
