import { NgModule, Type } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { FileControlComponent } from './file-control.component';
import { XmTranslationModule } from '@xm-ngx/translation';

@NgModule({
    imports: [
        MatFormFieldModule,
        MatIconModule,
        XmTranslationModule,
        ControlErrorModule,
        MatInputModule,
        MatButtonModule,
    ],
    exports: [FileControlComponent],
    declarations: [FileControlComponent],
})
export class FileControlModule {
    public entry: Type<FileControlComponent> = FileControlComponent;
}
