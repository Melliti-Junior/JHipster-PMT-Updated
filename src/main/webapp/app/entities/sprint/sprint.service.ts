import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { Sprint } from './sprint.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class SprintService {

    private resourceUrl =  SERVER_API_URL + 'api/sprints';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/sprints';

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    create(sprint: Sprint): Observable<Sprint> {
        const copy = this.convert(sprint);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(sprint: Sprint): Observable<Sprint> {
        const copy = this.convert(sprint);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: string): Observable<Sprint> {
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
     * Convert a returned JSON object to Sprint.
     */
    private convertItemFromServer(json: any): Sprint {
        const entity: Sprint = Object.assign(new Sprint(), json);
        entity.startDate = this.dateUtils
            .convertLocalDateFromServer(json.startDate);
        entity.endDate = this.dateUtils
            .convertLocalDateFromServer(json.endDate);
        return entity;
    }

    /**
     * Convert a Sprint to a JSON which can be sent to the server.
     */
    private convert(sprint: Sprint): Sprint {
        const copy: Sprint = Object.assign({}, sprint);
        copy.startDate = this.dateUtils
            .convertLocalDateToServer(sprint.startDate);
        copy.endDate = this.dateUtils
            .convertLocalDateToServer(sprint.endDate);
        return copy;
    }
}
