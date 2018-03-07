import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { IssuePriority } from './issue-priority.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class IssuePriorityService {

    private resourceUrl =  SERVER_API_URL + 'api/issue-priorities';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/issue-priorities';

    constructor(private http: Http) { }

    create(issuePriority: IssuePriority): Observable<IssuePriority> {
        const copy = this.convert(issuePriority);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(issuePriority: IssuePriority): Observable<IssuePriority> {
        const copy = this.convert(issuePriority);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: string): Observable<IssuePriority> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: string): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    search(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceSearchUrl, options)
            .map((res: any) => this.convertResponse(res));
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }

    /**
     * Convert a returned JSON object to IssuePriority.
     */
    private convertItemFromServer(json: any): IssuePriority {
        const entity: IssuePriority = Object.assign(new IssuePriority(), json);
        return entity;
    }

    /**
     * Convert a IssuePriority to a JSON which can be sent to the server.
     */
    private convert(issuePriority: IssuePriority): IssuePriority {
        const copy: IssuePriority = Object.assign({}, issuePriority);
        return copy;
    }
}
