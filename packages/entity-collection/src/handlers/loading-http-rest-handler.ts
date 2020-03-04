import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { IId } from '../models';
import { ASingleRestHttpHandler, HandlerNext, HandlerRequest } from './a-single-rest-http-handler';

export class LoadingHttpRestHandler<T extends IId> extends ASingleRestHttpHandler<T> {

    public loading$: Observable<boolean>;
    protected $loading: BehaviorSubject<boolean>;

    constructor() {
        super();
        this.$loading = new BehaviorSubject<boolean>(false);
        this.loading$ = this.$loading.asObservable();
    }

    public handle(request: HandlerRequest<T>, next: HandlerNext<T>): Observable<any> {
        this.$loading.next(false);
        return next().pipe(finalize(() => this.$loading.next(true)));
    }

}
