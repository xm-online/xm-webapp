import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, NgZone } from '@angular/core';

import { AuthServerProvider } from '@xm-ngx/core/user';
import SwaggerUI from 'swagger-ui';

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
})
export class JhiDocsComponent implements AfterViewInit {

    public config: JhiDocsComponentConfig;
    public swaggerResources: SwaggerResource[];
    public currentResource: string;

    constructor(
        private http: HttpClient,
        private auth: AuthServerProvider,
        private ngZone: NgZone
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
            SwaggerUI({
                dom_id: '#swaggerHolder',
                supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
                url: `${resource}`,
                docExpansion: 'none',
                apisSorter: 'alpha',
                showRequestHeaders: false,
                validatorUrl: null,
                configs: {
                    preFetch: (req) => {
                        if (prefix) {
                            try {
                                const url = new URL(req.url);
                                if (!url.pathname.startsWith(prefix)) {
                                    url.pathname = prefix + url.pathname;
                                    req.url = url.toString();
                                }
                            } catch (e) {
                            }
                        }

                        if (authToken) {
                            req.headers.Authorization = `Bearer ${authToken}`;
                        }
                        return req;
                    },
                },
            });
        });

    }

}
