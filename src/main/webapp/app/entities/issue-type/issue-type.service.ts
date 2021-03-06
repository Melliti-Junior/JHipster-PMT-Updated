import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { IssueType } from './issue-type.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class IssueTypeService {

    private resourceUrl =  SERVER_API_URL + 'api/issue-types';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/issue-types';

    ObjReturned: IssueType;

    constructor(private http: Http) { }

    create(issueType: IssueType): Observable<IssueType> {
        const copy = this.convert(issueType);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(issueType: IssueType): Observable<IssueType> {
        const copy = this.convert(issueType);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: string): Observable<IssueType> {
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

    /**
     *
     * this function return an entity by request
     *
     * @param {*} [req]
     * @returns {IssueType}
     * @memberof IssueTypeService
     */
    findByRequest(req?: any): IssueType {
        const result = this.search({ query: req });
        // result.subscribe((val) => console.log('val ' + JSON.stringify(val.json)));
        result.subscribe((val) => this.ObjReturned = this.convertItemFromServer(JSON.stringify(val.json)));
        return this.ObjReturned;
    }

    getTypes():  Promise<IssueType[]> {
        return this.http.get(this.resourceUrl)
          .toPromise()
          .then((response) => response.json() as IssueType[])
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
     * Convert a returned JSON object to IssueType.
     */
    private convertItemFromServer(json: any): IssueType {
        this.ObjReturned = Object.assign(new IssueType(), json);
        return this.ObjReturned;
    }

    /**
     * Convert a IssueType to a JSON which can be sent to the server.
     */
    private convert(issueType: IssueType): IssueType {
        const copy: IssueType = Object.assign({}, issueType);
        return copy;
    }
}
