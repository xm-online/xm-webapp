import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface IFeedbackRequest {
    topic: string;
    message: string;
    version?: string;
    image?: string;
}

@Injectable({
    providedIn: 'root',
})
export class FeedbackService {

    constructor(private httpClient: HttpClient) {
    }

    public create(attributes: IFeedbackRequest, url: string): Observable<unknown> {
        return this.httpClient.post(url, { attributes });
    }
}
