import { XmBreadcrumb } from '@xm-ngx/components/breadcrumb';
import { Observable, of } from 'rxjs';

export class MockXmBreadcrumbStore {
    public breadcrumbs$: Observable<XmBreadcrumb[]> = of(null);

}
