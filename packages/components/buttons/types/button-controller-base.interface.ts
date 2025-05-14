import { Observable } from 'rxjs';

export interface ControllerBaseInterface {
    loading$?: Observable<boolean>;
    disabled$?: Observable<boolean>;
}
