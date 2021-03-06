import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { Status } from './status.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class StatusService {

    private resourceUrl =  SERVER_API_URL + 'api/statuses';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/statuses';
    ObjReturned: Status;
    constructor(private http: Http) { }

    create(status: Status): Observable<Status> {
        const copy = this.convert(status);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(status: Status): Observable<Status> {
        const copy = this.convert(status);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: string): Observable<Status> {
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
     * @returns {Status}
     * @memberof StatusService
     */
    findByRequest(req?: any): Status {
        const result = this.search({ query: req });
        // result.subscribe((val) => console.log('val ' + JSON.stringify(val.json)));
        result.subscribe((val) => this.ObjReturned = this.convertItemFromServer(JSON.stringify(val.json)));
        return this.ObjReturned;
    }

    getStatuses():  Promise<Status[]> {
        return this.http.get(this.resourceUrl)
          .toPromise()
          .then((response) => response.json() as Status[])
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
     * Convert a returned JSON object to Status.
     */
    private convertItemFromServer(json: any): Status {
        this.ObjReturned = Object.assign(new Status(), json);
        return this.ObjReturned;
    }

    /**
     * Convert a Status to a JSON which can be sent to the server.
     */
    private convert(status: Status): Status {
        const copy: Status = Object.assign({}, status);
        return copy;
    }
}
