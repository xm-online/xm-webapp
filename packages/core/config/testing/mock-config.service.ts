import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class MockConfigService {
    public getUaaDataSchema(roleKey: string): Observable<any> {
        return of(null);
    }
}