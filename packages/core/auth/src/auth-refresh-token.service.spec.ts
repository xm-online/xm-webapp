import { TestBed } from '@angular/core/testing';

import { AuthRefreshTokenService } from './auth-refresh-token.service';

describe('AuthRefreshTokenService', () => {
  let service: AuthRefreshTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthRefreshTokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
