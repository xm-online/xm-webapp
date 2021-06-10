import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoadingBarModule } from '@xm-ngx/components/loading bar';
import { XmTranslationModule } from '@xm-ngx/translation';
import { LoadingDialogComponent } from './loading-dialog.component';

@NgModule({
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        XmTranslationModule,
        LoadingBarModule
    ],
    declarations: [
        LoadingDialogComponent
    ],
    exports: [
        LoadingDialogComponent
    ],
})
export class LoadingDialogModule {
    public entry: Type<LoadingDialogComponent> = LoadingDialogComponent;
}
