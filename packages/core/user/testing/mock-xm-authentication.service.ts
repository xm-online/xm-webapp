import { Injectable } from '@angular/core';

@Injectable()
export class MockXmAuthenticationService {

    public isSureGuestSession(): boolean {
        return false;
    }

}
