import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { I18nNamePipe } from '@xm-ngx/translation';
import { TitleService } from '@xm-ngx/translation';
import { Principal } from '@xm-ngx/core/user';

import { PageTitleService } from './page-title.service';
import { PageService } from '@xm-ngx/core/dashboard';

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
