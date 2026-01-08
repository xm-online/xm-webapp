import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { XmTranslationModule } from '@xm-ngx/translation';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { JsonSchemaFormService } from '@ajsf/core';

@Component({
    standalone: true,
    imports: [CommonModule, FormsModule, MatFormFieldModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, XmTranslationModule],
    selector: 'xm-ajfs-file-upload',
    templateUrl: 'file-upload.component.html',
    styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements OnInit, OnDestroy {

    public options: any;
    public controlValue: any;
    public uploadingError: boolean = false;
    public progress: number;
    public file: any;
    public uploadProcess: any;

    @Input() public layoutNode: any;

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
        if (event.target.files.length > 0) {
            this.file = event.target.files[0];
        }
    }

    public uploadFile(fileData: any): void {
        if (!fileData) {
            return;
        }

        this.progress = 1;
        this.registerChanges();

        const file = fileData;
        const formData: FormData = new FormData();
        formData.append('file', file, file.name);

        const additionalParameters = this.options?.additionalParameters;
        if (additionalParameters) {
            Object.keys(additionalParameters).forEach((key) => {
                const parameter = additionalParameters[key];
                if (parameter.hasOwnProperty('value')) {
                    formData.append(key, parameter.value);
                }
                if (parameter.hasOwnProperty('valueExpression')) {
                    const value = new Function('model', 'options', 'return '
                        + parameter.valueExpression)(this.jsf.getData(), this.jsf.formOptions);
                    formData.append(key, value);
                }
            });
        }

        if (this.options.tokenSource) {
            this.httpClient
                .get(this.options.tokenSource)
                .subscribe((resp: any) => {
                    const headers: HttpHeaders = new HttpHeaders({
                        Authorization: resp.token_type + ' ' + resp.access_token,
                        'ngsw-bypass': 'true'
                    });
                    this.saveFile(formData, headers);
                });
        } else {
            const headers: HttpHeaders = new HttpHeaders({
                'ngsw-bypass': 'true'
            });
            this.saveFile(formData, headers);
        }

    }

    public resetFile(): void {
        this.file = null;
        this.controlValue = null;
        this.progress = null;
        this.uploadingError = false;
        this.jsf.updateValue(this, this.controlValue);
    }

    private saveFile(formData: FormData, headers?: HttpHeaders): void {
        let apiUrl = this.options.url || null;
        this.uploadingError = false;
        if (apiUrl) {
            // Add ngsw-bypass query parameter to ensure service worker skips this request
            const separator = apiUrl.includes('?') ? '&' : '?';
            apiUrl = `${apiUrl}${separator}ngsw-bypass=true`;

            this.uploadProcess = this.httpClient
                .post(apiUrl, formData,
                    {
                        headers,
                        reportProgress: true,
                        observe: 'events',
                    },
                ).subscribe((event) => {
                    console.info(event.type, JSON.stringify(event));
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
        const progress = Math.round(100 * event.loaded / event.total);
        this.progress = progress < 1 ? 1 : progress;
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
