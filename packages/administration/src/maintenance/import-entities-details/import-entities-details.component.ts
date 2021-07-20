import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ImportEntitiesService } from '@xm-ngx/administration/maintenance/import-entities.service';
import { finalize } from 'rxjs/operators';

interface HTMLInputEvent extends Event {
    target: HTMLInputElement & EventTarget;
}

@Component({
    selector: 'xm-import-entities-details',
    templateUrl: './import-entities-details.component.html',
    styleUrls: ['./import-entities-details.component.scss'],
})
export class ImportEntitiesDetailsComponent {

    public showLoader: boolean;
    public importedJson: string;
    public parseError: boolean;

    constructor(
        private activeModal: MatDialogRef<ImportEntitiesDetailsComponent>,
        private importService: ImportEntitiesService,
    ) {
    }

    public onFileChange(e: HTMLInputEvent): void {
        this.importedJson = null;

        if (e.target && e.target.files) {
            const file = e.target.files[0];
            const myReader = new FileReader();
            myReader.onloadend = (loadEvent: ProgressEvent<FileReader>) => {
                try {
                    this.importedJson = JSON.parse(loadEvent.target.result as string);
                    this.parseError = false;
                } catch (e) {
                    this.parseError = true;
                }
            };
            myReader.readAsText(file);
        }
    }

    public onImport(): void {
        this.showLoader = true;
        this.importService
            .importEntities(this.importedJson)
            .pipe(finalize(() => this.showLoader = true))
            .subscribe((res) => {
                this.activeModal.close('success');
            }, err => {
                this.activeModal.close(err);
            });

    }
}
