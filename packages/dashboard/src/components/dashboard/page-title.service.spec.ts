import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { I18nNamePipe } from '@xm-ngx/components/language';
import { TitleService } from '@xm-ngx/translation';
import { Principal } from '@xm-ngx/core/auth';

import { PageTitleService } from './page-title.service';
import { PageService } from '../../stores/page/page.service';

describe('PageTitleService', () => {
    let service: PageTitleService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                PageTitleService,
                { provide: TitleService, useValue: {} },
                { provide: I18nNamePipe, useValue: {} },
                { provide: Principal, useValue: {} },
                { provide: ActivatedRoute, useValue: {} },
                { provide: PageService, useValue: {} },
            ],
        });
        service = TestBed.inject<PageTitleService>(PageTitleService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
