import { TestBed } from '@angular/core/testing';

import { XmPrivateUiConfigService } from './xm-private-ui-config.service';

describe('XmPrivateUiConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: XmPrivateUiConfigService = TestBed.inject(XmPrivateUiConfigService);
    expect(service).toBeTruthy();
  });
});
