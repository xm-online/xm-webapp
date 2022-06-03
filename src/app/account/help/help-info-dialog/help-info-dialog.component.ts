import { Component } from "@angular/core";
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
    selector: 'xm-help-info-dialog',
    templateUrl: './help-info-dialog.component.html',
    styleUrls: ['./help-info-dialog.component.scss'],
})
export class HelpInfoDialogComponent {
    public data: string = '';
    private durationInSeconds: number = 4;

    constructor(private snackBar: MatSnackBar) {
        this.getBrowserInfo();
        this.getOperatingSystemInfo();
    }

    public getBrowserInfo(): void {
        const nAgt = navigator.userAgent;
        let browserName  = navigator.appName;
        let fullVersion  = ''+parseFloat(navigator.appVersion);
        let nameOffset,verOffset,ix;

// In Opera, the true version is after "Opera" or after "Version"
        if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
            browserName = "Opera";
            fullVersion = nAgt.substring(verOffset+6);
            if ((verOffset=nAgt.indexOf("Version"))!=-1)
                fullVersion = nAgt.substring(verOffset+8);
        }
// In MSIE, the true version is after "MSIE" in userAgent
        else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
            browserName = "Microsoft Internet Explorer";
            fullVersion = nAgt.substring(verOffset+5);
        }
        else if ((verOffset=nAgt.indexOf("Edg")) != -1 || (verOffset=nAgt.indexOf("Edge")) != -1) {
            browserName = "Microsoft Edge";
            fullVersion = nAgt.substring(verOffset + 4);
        }
// In Chrome, the true version is after "Chrome"
        else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
            browserName = "Chrome";
            fullVersion = nAgt.substring(verOffset+7);
        }
// In Safari, the true version is after "Safari" or after "Version"
        else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
            browserName = "Safari";
            fullVersion = nAgt.substring(verOffset+7);
            if ((verOffset=nAgt.indexOf("Version"))!=-1)
                fullVersion = nAgt.substring(verOffset+8);
        }
// In Firefox, the true version is after "Firefox"
        else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
            browserName = "Firefox";
            fullVersion = nAgt.substring(verOffset+8);
        }
// In most other browsers, "name/version" is at the end of userAgent
        else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) <
            (verOffset=nAgt.lastIndexOf('/')) )
        {
            browserName = nAgt.substring(nameOffset,verOffset);
            fullVersion = nAgt.substring(verOffset+1);
            if (browserName.toLowerCase()==browserName.toUpperCase()) {
                browserName = navigator.appName;
            }
        }

        if ((ix=fullVersion.indexOf(";"))!=-1)
            fullVersion=fullVersion.substring(0,ix);
        if ((ix=fullVersion.indexOf(" "))!=-1)
            fullVersion=fullVersion.substring(0,ix);

        this.data += 'Browser name: ' + browserName + '<br>';
        this.data += 'Full version: ' + fullVersion + '<br>';
        this.data += 'navigator.appName: ' + navigator.appName + '<br>';
        this.data += 'navigator.userAgent: ' + navigator.userAgent + '<br>';
    }

    public getOperatingSystemInfo(): void {
        let OSName="Unknown OS";
        if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
        if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
        if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
        if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";

        this.data += 'Your OS: '+ OSName + '<br>';
    }

    public copyTextToClipboard(): void {
        const tempText = this.deleteBrTagForCopy(this.data);
        navigator.clipboard.writeText(tempText).then();
        this.snackBar.openFromComponent(CopiedSnackBarComponent, {
            duration: this.durationInSeconds * 1000,
        });
    }

    private deleteBrTagForCopy(data: string): string {
        return data
            .split('<br>')
            .filter((item, pos, self) => self.indexOf(item) == pos)
            .join('');
    }
}

@Component({
    selector: 'cl-copied-snackbar',
    template:
        `
            <span>
                Copied to clipboard
            </span>
        `,
})
export class CopiedSnackBarComponent {}
