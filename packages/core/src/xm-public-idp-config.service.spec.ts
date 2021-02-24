import { TestBed } from '@angular/core/testing';

import { XmPublicIdpConfigService } from './xm-public-idp-config.service';

describe('XmPublicIdpConfigService', () => {
  let service: XmPublicIdpConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(XmPublicIdpConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
