import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { Step } from './step.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class StepService {

    private resourceUrl =  SERVER_API_URL + 'api/steps';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/steps';

    constructor(private http: Http) { }

    create(step: Step): Observable<Step> {
        const copy = this.convert(step);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(step: Step): Observable<Step> {
        const copy = this.convert(step);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: string): Observable<Step> {
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
     * Convert a returned JSON object to Step.
     */
    private convertItemFromServer(json: any): Step {
        const entity: Step = Object.assign(new Step(), json);
        return entity;
    }

    /**
     * Convert a Step to a JSON which can be sent to the server.
     */
    private convert(step: Step): Step {
        const copy: Step = Object.assign({}, step);
        return copy;
    }
}
