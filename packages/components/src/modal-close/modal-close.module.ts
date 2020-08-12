import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalCloseComponent } from './modal-close.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
    declarations: [ModalCloseComponent],
    exports: [
        ModalCloseComponent
    ],
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule
    ]
})
export class ModalCloseModule { }
