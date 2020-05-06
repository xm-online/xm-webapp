import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@xm-ngx/core/environment';
import { Observable } from 'rxjs';

export interface IFeedbackRequest {
    topic: string;
    message: string;
}

@Injectable({
    providedIn: 'root',
})
export class FeedbackService {

    constructor(private httpClient: HttpClient) { }

    /** @todo: url should be passed from configs */
    public create(attributes: IFeedbackRequest, url: string = `${environment.serverApiUrl}/entity/api/functions/FEEDBACK`): Observable<unknown> {
        return this.httpClient.post(url, {attributes});
    }
}
