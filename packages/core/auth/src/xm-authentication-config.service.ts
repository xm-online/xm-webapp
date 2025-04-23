import { inject, Injectable } from '@angular/core';
import { TOKEN_URL } from '@xm-ngx/core/user';

@Injectable()
export class XmAuthenticationConfig {
    public errorCodeUnauthorized = 401;
    public tokenUrl: string = inject(TOKEN_URL);
}
