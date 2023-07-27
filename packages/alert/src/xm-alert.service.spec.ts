import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { XmTranslationTestingModule } from '@xm-ngx/translation/testing';

import { XmAlertService } from './xm-alert.service';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { XmAlertComponent } from './xm-alert.component';
import { XmAlertResult } from './xm-alert-compatibility.interface';

describe('XmAlertService', () => {
    let service: XmAlertService;
    let matDialog: MatDialog;

    let matDialogOpenSpy: jasmine.Spy;
    let matDialogRefSpyObj: jasmine.SpyObj<MatDialogRef<XmAlertComponent, XmAlertResult>>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                MatDialogModule,
                XmTranslationTestingModule,
                HttpClientTestingModule,
            ],
            providers: [
                XmAlertService,
            ],
        });

        service = TestBed.inject(XmAlertService);
        matDialog = TestBed.inject(MatDialog);
        
        matDialogRefSpyObj = jasmine.createSpyObj({
            afterClosed : of({}),
        });

        matDialogOpenSpy = spyOn(matDialog, 'open').and.returnValue(matDialogRefSpyObj);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should be MatDialog open called', () => {
        service.open({});

        expect(matDialogOpenSpy).toHaveBeenCalled();
    });

    it('delete method should call afterClosed', () => {
        service.delete({});

        expect(matDialogRefSpyObj.afterClosed).toHaveBeenCalled();
    });

    it('yesCancel method should call afterClosed', () => {
        service.yesCancel({});

        expect(matDialogOpenSpy).toHaveBeenCalled();

        expect(matDialogRefSpyObj.afterClosed).toHaveBeenCalled();
    });

    it('yesNo method should call afterClosed', () => {
        service.yesNo({});

        expect(matDialogOpenSpy).toHaveBeenCalled();

        expect(matDialogRefSpyObj.afterClosed).toHaveBeenCalled();
    });

    it('open method with empty parameters should be overridden by defaults', () => {
        service.open({});

        expect(matDialogOpenSpy).toHaveBeenCalledWith(XmAlertComponent, {
            width: '640px',
            panelClass: 'xm-alert',
            disableClose: false,
            autoFocus: 'dialog',
            data: {
                iconColor: '#E41E26',
                dialogActionsAlign: 'end',
                showConfirmButton: true,
                showCancelButton: true,
                cancelButtonText: 'global.common.cancel',
                confirmButtonText: 'global.common.yes',
            },
        });
    });
});
