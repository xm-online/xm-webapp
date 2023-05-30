import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { JhiHealth, JhiHealthService } from './health.service';


@Component({
    selector: 'xm-health-modal',
    templateUrl: './health-modal.component.html',
})
export class JhiHealthModalComponent implements OnInit {

    public currentHealth: JhiHealth;
    public editorValue: string;

    constructor(public activeModal: MatDialogRef<JhiHealthModalComponent>,
                private healthService: JhiHealthService) {
    }

    public ngOnInit(): void {
        this.editorValue = JSON.stringify(this.currentHealth, null, 4) || null;
    }

    public baseName(name: string): string {
        return this.healthService.getBaseName(name);
    }

    public subSystemName(name: string): string {
        return this.healthService.getSubSystemName(name);
    }

    public readableValue(value: number): string {
        if (this.currentHealth.name !== 'diskSpace') {
            return value.toString();
        }

        // Should display storage space in an human readable unit
        const val = value / 1073741824;
        if (val > 1) { // Value
            return val.toFixed(2) + ' GB';
        } 
        return (value / 1048576).toFixed(2) + ' MB';
        
    }
}
