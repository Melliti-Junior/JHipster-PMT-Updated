import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { Workflow } from './workflow.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class WorkflowService {

    private resourceUrl =  SERVER_API_URL + 'api/workflows';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/workflows';

    constructor(private http: Http) { }

    create(workflow: Workflow): Observable<Workflow> {
        const copy = this.convert(workflow);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(workflow: Workflow): Observable<Workflow> {
        const copy = this.convert(workflow);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: string): Observable<Workflow> {
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
     * Convert a returned JSON object to Workflow.
     */
    private convertItemFromServer(json: any): Workflow {
        const entity: Workflow = Object.assign(new Workflow(), json);
        return entity;
    }

    /**
     * Convert a Workflow to a JSON which can be sent to the server.
     */
    private convert(workflow: Workflow): Workflow {
        const copy: Workflow = Object.assign({}, workflow);
        return copy;
    }
}
