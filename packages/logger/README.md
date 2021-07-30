# XmLogger

Logger path:`@xm-ngx/logger`

Logger testing path: `@xm-ngx/logger/testing`

Declare dependencies at the root module:

```typescript
import { NgModule } from '@angular/core';
import { XmLoadingModule } from '@xm-ngx/logger';

@NgModule({
  imports: [XmLoadingModule.forRoot()],
})
export class AppModule {
}

```
