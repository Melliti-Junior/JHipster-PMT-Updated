import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { Resolution } from './resolution.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class ResolutionService {

    private resourceUrl =  SERVER_API_URL + 'api/resolutions';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/resolutions';

    ObjReturned: Resolution;
    constructor(private http: Http) { }

    create(resolution: Resolution): Observable<Resolution> {
        const copy = this.convert(resolution);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(resolution: Resolution): Observable<Resolution> {
        const copy = this.convert(resolution);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: string): Observable<Resolution> {
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
     * @returns {Resolution}
     * @memberof ResolutionService
     */
    findByRequest(req?: any): Resolution {
        const result = this.search({ query: req });
        // result.subscribe((val) => console.log('val ' + JSON.stringify(val.json)));
        result.subscribe((val) => this.ObjReturned = this.convertItemFromServer(JSON.stringify(val.json)));
        return this.ObjReturned;
    }

    getResolutions():  Promise<Resolution[]> {
        return this.http.get(this.resourceUrl)
          .toPromise()
          .then((response) => response.json() as Resolution[])
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
     * Convert a returned JSON object to Resolution.
     */
    private convertItemFromServer(json: any): Resolution {
        this.ObjReturned = Object.assign(new Resolution(), json);
        return this.ObjReturned;
    }

    /**
     * Convert a Resolution to a JSON which can be sent to the server.
     */
    private convert(resolution: Resolution): Resolution {
        const copy: Resolution = Object.assign({}, resolution);
        return copy;
    }
}
