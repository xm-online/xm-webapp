import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { JsonSchemaFormService } from 'angular2-json-schema-form';
import { ContentUploaderLayoutNode } from './content-uploader.layoutNode';
import { ContentUploaderOptions } from './content-uploader-options.model';

@Component({
    selector: 'xm-ajfs-file-upload',
    templateUrl: 'content-uploader.component.html',
    styleUrls: ['./content-uploader.component.scss'],
})
export class ContentUploaderComponent implements OnInit, OnDestroy {

    public options: ContentUploaderOptions;
    public controlValue: any;
    public uploadingError: boolean = false;
    public uploadingSizeError: boolean = false;
    public progress: number;
    public file: any;
    public uploadProcess: any;

    @Input() public layoutNode: ContentUploaderLayoutNode;

    constructor(private jsf: JsonSchemaFormService,
                private changeDetectorRef: ChangeDetectorRef,
                private httpClient: HttpClient) {
    }

    public ngOnInit(): void {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
    }

    public ngOnDestroy(): void {
        if (this.uploadProcess) {
            this.uploadProcess.unsubscribe();
        }
    }

    public updateFile(event: any): void {
        if (event.target.files.length > 0 && event.target.files[0].size <= this.options.maxFileSize) {
            this.resetFile();
            this.file = event.target.files[0];
        } else if (event.target.files[0].size >= this.options.maxFileSize) {
            this.uploadingSizeError = true;
        }
    }

    public async uploadFile(fileData: any): Promise<void> {
        if (!fileData) {return undefined; }
        const file = fileData;
        const fileBase64 = await this.convertBase64(file);
        const formData: FormData = new FormData();
        formData.append('file', fileBase64);
        formData.append('fileName', file.name);
        this.saveFile(formData);
    }

    public resetFile(): void {
        this.file = null;
        this.controlValue = null;
        this.progress = null;
        this.uploadingError = false;
        this.uploadingSizeError = false;
        this.jsf.updateValue(this, this.controlValue);
    }

    private convertBase64(file: any): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.toString());
            reader.onerror = error => reject(error);
        });
    }

    private saveFile(formData: FormData, headers?: HttpHeaders): void {
        const apiUrl = this.options.url || null;
        this.uploadingError = false;
        if (apiUrl) {
            this.uploadProcess = this.httpClient
                .post(apiUrl, formData,
                    {
                        headers,
                        reportProgress: true,
                        observe: 'events',
                    },
                ).subscribe((event) => {
                    if (event.type === HttpEventType.UploadProgress) {
                        this.updateProgress(event);
                    } else if (event.type === HttpEventType.Response) {
                        this.updateData(event.body);
                    }
                }, (err) => {
                    this.handleError(err);
                });
        }
    }

    private updateProgress(event: any): void {
        this.progress = Math.round(100 * event.loaded / event.total);
        this.registerChanges();
    }

    private updateData(res: any): void {
        this.jsf.updateValue(this, res.data.key);
        this.progress = null;
        this.registerChanges();
    }

    private handleError(err?: any): void {
        console.warn(err);
        this.uploadingError = true;
        this.progress = null;
        this.registerChanges();
    }

    private registerChanges(): void {
        this.changeDetectorRef.detectChanges();
    }
}
