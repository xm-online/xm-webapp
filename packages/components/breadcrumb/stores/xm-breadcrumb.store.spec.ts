import { TestBed } from '@angular/core/testing';
import { XmBreadcrumbStore } from './xm-breadcrumb.store';
import { MockXmBreadcrumbResolver } from '@xm-ngx/components/breadcrumb/testing';
import { XmBreadcrumbResolver } from '@xm-ngx/components/breadcrumb';
import { RouterTestingModule } from '@angular/router/testing';

describe('XmBreadcrumbStoreService', () => {
    let service: XmBreadcrumbStore;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                XmBreadcrumbStore,
                { provide: XmBreadcrumbResolver, useClass: MockXmBreadcrumbResolver },
            ],
        });
        service = TestBed.inject(XmBreadcrumbStore);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
