import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { XmDynamicWidget } from '@xm-ngx/dynamic';

@Component({
    selector: 'xm-iframe-widget',
    templateUrl: './iframe-widget.component.html',
})
export class IframeWidgetComponent implements OnInit, XmDynamicWidget {

    public name: any;
    public url: any;
    @Input() public config: any;

    constructor(private sanitizer: DomSanitizer, private route: ActivatedRoute) {
    }

    public ngOnInit(): void {
        this.name = this.config.name;
        if (this.route.snapshot && this.route.snapshot.queryParams && this.route.snapshot.queryParams.contentUrl) {
            this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.route.snapshot.queryParams.contentUrl);
        } else if (this.config.url) {
            this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.config.url);
        }
    }

}
