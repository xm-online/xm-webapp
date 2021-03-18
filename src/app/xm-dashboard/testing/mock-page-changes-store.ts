import { Observable, of } from 'rxjs';
import { PageChangesStoreType } from '../page-changes-store';

export class MockPageChangesStore {
    public state$(): Observable<PageChangesStoreType> {
        return of(PageChangesStoreType.PRISTINE);
    }

    public setState(state: PageChangesStoreType): void {
        // Mock empty
    }
}
