import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, NgForm } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef } from '@angular/material/dialog';
import { XmEventManager } from '@xm-ngx/core';
import { Observable } from 'rxjs';
import { finalize, map, startWith } from 'rxjs/operators';

import { Client, ClientService } from '@xm-ngx/core/client';
import { RoleService } from '@xm-ngx/core/role';
import { XmConfigService } from '@xm-ngx/core/config';
import { JhiLanguageHelper } from '@xm-ngx/translation';

export const CLIENT_UNIQUE_ID_ERROR_CODE = 'client.already.exists';

@Component({
    selector: 'xm-client-mgmt-dialog',
    styleUrls: ['./client-management-dialog.component.scss'],
    templateUrl: './client-management-dialog.component.html',
})
export class ClientMgmtDialogComponent implements OnInit {

    @Input() public selectedClient: Client;

    @ViewChild('editForm', { static: false }) public editForm: NgForm;
    public client: Client;
    @ViewChild('scopeInput', { static: false })
    public scopeInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto', { static: false })
    public matAutocomplete: MatAutocomplete;

    public languages: any[];
    public scopes: any[] = [];
    public authorities: any[];
    public showLoader: boolean;
    public clientIdNotUnique: boolean;
    public scopesVariants: any[] = [];
    public separatorKeysCodes: number[] = [ENTER, COMMA];
    public scopeCtrl: UntypedFormControl = new UntypedFormControl();
    public filteredScopes: Observable<string[]>;

    constructor(public activeModal: MatDialogRef<ClientMgmtDialogComponent>,
                private languageHelper: JhiLanguageHelper,
                private clientService: ClientService,
                private roleService: RoleService,
                private eventManager: XmEventManager,
                private xmConfigService: XmConfigService) {
        this.filteredScopes = this.scopeCtrl.valueChanges.pipe(
            startWith(null),
            map((scope: string | null) => scope ? this._filter(scope) : this.scopesVariants.slice()));
    }

    public add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        if ((value || '').trim()) {
            this.scopes.push(value.trim());
        }

        if (input) {
            input.value = '';
        }

        this.scopeCtrl.setValue(null);
    }

    public remove(scope: string): void {
        const index = this.scopes.indexOf(scope);
        if (index >= 0) {
            this.scopes.splice(index, 1);
        }
    }

    public selected(event: MatAutocompleteSelectedEvent): void {
        this.scopes.push(event.option.viewValue);
        this.scopeInput.nativeElement.value = '';
        this.scopeCtrl.setValue(null);
    }

    public ngOnInit(): void {
        if (this.selectedClient) {
            this.client = {
                id: this.selectedClient.id,
                clientId: this.selectedClient.clientId,
                clientSecret: this.selectedClient.clientSecret,
                roleKey: this.selectedClient.roleKey,
                description: this.selectedClient.description,
                createdBy: this.selectedClient.createdBy,
                createdDate: this.selectedClient.createdDate,
                lastModifiedBy: this.selectedClient.lastModifiedBy,
                lastModifiedDate: this.selectedClient.lastModifiedDate,
                accessTokenValiditySeconds: this.selectedClient.accessTokenValiditySeconds,
                scopes: this.selectedClient.scopes || [],
            };
        } else {
            this.client = {};
        }
        this.roleService.getRoles().subscribe((roles) => {
            this.authorities = roles.map((role) => role.roleKey).sort();
        });
        this.xmConfigService.getUiConfig().subscribe((config) => {
            this.languageHelper.getAll().then((languages) => {
                this.languages = (config && config.langs) ? config.langs : languages;
            });
            if (config.client) {
                this.scopesVariants = config.client.scopes || [];
            }
        });
        this.scopes = this.client.scopes || [];
    }

    public clear(): void {
        this.activeModal.close(false);
    }

    public save(): void {
        this.clientIdNotUnique = false;
        this.showLoader = true;
        this.client.clientId = this.client.clientId.trim();
        if (this.client.description) {
            this.client.description = this.client.description.trim();
        }
        this.client.scopes = this.scopes || [];
        this.clientService[this.client.id ? 'update' : 'create'](this.client)
            .pipe(finalize(() => this.showLoader = false))
            .subscribe(
                (response) => this.onSaveSuccess(response),
                (err) => this.checkErrorForClientId(err));
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.scopesVariants.filter(scope => scope.toLowerCase().indexOf(filterValue) >= 0);
    }

    private onSaveSuccess(result: any): void {
        this.eventManager.broadcast({ name: 'clientListModification', content: 'OK' });
        this.activeModal.close(result);
    }

    private checkErrorForClientId(err: any): void {
        this.clientIdNotUnique = err && err.error && err.error.error === CLIENT_UNIQUE_ID_ERROR_CODE;
        const ctrlKey = 'clientId';
        if (this.clientIdNotUnique) {
            const ctrl = this.editForm.form.controls[ctrlKey];
            ctrl.setErrors(['valueNotUnique'], { emitEvent: true });
        }
    }

}
