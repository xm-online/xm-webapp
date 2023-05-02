import { Injectable } from '@angular/core';
import { XmEntity } from '@xm-ngx/entity';
import { HttpClientRest, XmRepositoryConfig } from '@xm-ngx/components/entity-collection';
import { PageableAndSortable } from '@xm-ngx/components/entity-collection/i-entity-collection-pageable';
import { XmDynamicService } from '@xm-ngx/dynamic';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class XmHttpRepository<T extends XmEntity>
    extends HttpClientRest<T, PageableAndSortable>
    implements XmDynamicService<XmRepositoryConfig> {
    public config: { resourceUrl: string };

    constructor(httpClient: HttpClient) {
        super(null, httpClient);
    }

    protected override resourceUrl(): string {
        return this.config.resourceUrl;
    }
}

