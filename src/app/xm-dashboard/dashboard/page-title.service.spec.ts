import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { I18nNamePipe } from '@xm-ngx/components/language';
import { PageService } from '@xm-ngx/dashboard';
import { TitleService } from '@xm-ngx/translation';
import { Principal } from '../../shared/auth';

import { PageTitleService } from './page-title.service';

describe('PageTitleService', () => {
    let service: PageTitleService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
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
