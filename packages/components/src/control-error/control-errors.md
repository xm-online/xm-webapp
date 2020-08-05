The directive generates error messages from the FormControl errors.

### Control Errors

#### Quickstart

Import `ControlErrorModule` module in Angular app.
```typescript
import { ControlErrorModule } from '@xm-ngx/components/control-error';

@NgModule({
    imports: [
        ControlErrorModule,
    ],
})
```

Declare `myControl` property and add validators.
```typescript
 myControl = new FormControl(null, Validators.required);
```

Pass an object with errors to the `xmControlErrors`.
```html
<mat-error *xmControlErrors="myControl.errors; message as message">{{message}}</mat-error>
```
