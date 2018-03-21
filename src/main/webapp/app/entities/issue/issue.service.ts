import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { Issue } from './issue.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class IssueService {

    private resourceUrl =  SERVER_API_URL + 'api/issues';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/issues';

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    create(issue: Issue): Observable<Issue> {
        const copy = this.convert(issue);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(issue: Issue): Observable<Issue> {
        const copy = this.convert(issue);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: string): Observable<Issue> {
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
     * Convert a returned JSON object to Issue.
     */
    private convertItemFromServer(json: any): Issue {
        const entity: Issue = Object.assign(new Issue(), json);
        entity.createdDate = this.dateUtils
            .convertLocalDateFromServer(json.createdDate);
        entity.dueDate = this.dateUtils
            .convertLocalDateFromServer(json.dueDate);
        entity.updatedDate = this.dateUtils
            .convertLocalDateFromServer(json.updatedDate);
        return entity;
    }

    /**
     * Convert a Issue to a JSON which can be sent to the server.
     */
    private convert(issue: Issue): Issue {
        const copy: Issue = Object.assign({}, issue);
        copy.createdDate = this.dateUtils
            .convertLocalDateToServer(issue.createdDate);
        copy.dueDate = this.dateUtils
            .convertLocalDateToServer(issue.dueDate);
        copy.updatedDate = this.dateUtils
            .convertLocalDateToServer(issue.updatedDate);
        return copy;
    }
}
