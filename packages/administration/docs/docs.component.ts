import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, NgZone } from '@angular/core';

import { AuthServerProvider } from '@xm-ngx/core/user';
import { XmCoreConfig } from '@xm-ngx/core';
import { SwaggerUIBundle } from 'swagger-ui-dist';

interface SwaggerResource {
    location: string;
    name: string;
    swaggerVersion: string;
}

interface JhiDocsComponentConfig {
    swaggerResources: SwaggerResource[];
}

@Component({
    selector: 'xm-docs',
    templateUrl: './docs.component.html',
    styles: [
        `
            :host ::ng-deep #swaggerHolder .col-12 {
                padding-left: 0;
                padding-right: 0;
            }

            :host ::ng-deep #swaggerHolder .scheme-container {
                display: none;
            }
        `,
    ],
    standalone: false,
})
export class JhiDocsComponent implements AfterViewInit {

    public config: JhiDocsComponentConfig;
    public swaggerResources: SwaggerResource[];
    public currentResource: string;

    constructor(
        private http: HttpClient,
        private auth: AuthServerProvider,
        private coreConfig: XmCoreConfig,
        private ngZone: NgZone,
    ) {
    }

    public ngAfterViewInit(): void {
        if (!this.config?.swaggerResources) {
            this.http
                .get<SwaggerResource[]>('/swagger-resources')
                .subscribe((data: SwaggerResource[]) => {
                    this.swaggerResources = data;
                    this.currentResource = this.swaggerResources[0].location;
                    this.updateSwagger(this.currentResource);
                });
        } else {
            this.swaggerResources = this.config?.swaggerResources;
            this.currentResource = this.swaggerResources[0].location;
            this.updateSwagger(this.currentResource);
        }
    }

    public updateSwagger(resource: string): void {
        const authToken = this.auth.getToken();
        let prefix = null;
        if (this.config?.swaggerResources) {
            prefix = this.config.swaggerResources.find(swaggerResource => swaggerResource.location === resource)?.name;
        }

        this.ngZone.runOutsideAngular(() => {
            SwaggerUIBundle({
                dom_id: '#swaggerHolder',
                supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
                url: `${resource}`,
                docExpansion: 'none',
                tagsSorter: 'alpha',
                validatorUrl: null,
                requestInterceptor: (req) => {
                    // swagger-ui uses its own fetch, so ProxyInterceptor never sees these
                    // requests and SERVER_API_URL has to be prepended here
                    const apiBase = this.coreConfig.SERVER_API_URL || '';
                    try {
                        const url = new URL(req.url, location.origin);
                        if (url.origin === location.origin) {
                            if (prefix && !url.pathname.startsWith(prefix)) {
                                url.pathname = prefix + url.pathname;
                            }
                            if (apiBase && !url.pathname.startsWith(apiBase)) {
                                url.pathname = apiBase + url.pathname;
                            }
                            req.url = url.toString();
                        }
                    } catch (e) {

                    }

                    if (authToken) {
                        req.headers.Authorization = `Bearer ${authToken}`;
                    }
                    return req;
                },
            });
        });

    }

}
