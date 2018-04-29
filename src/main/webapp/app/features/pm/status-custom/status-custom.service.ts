import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../../app.constants';

import { StatusCustom } from './status-custom.model';
import { ResponseWrapper, createRequestOption } from '../../../shared';
import {ColumnCustom} from "../column-custom/column-custom.model";

@Injectable()
export class StatusCustomService {

    private resourceUrl =  SERVER_API_URL + 'api/custom/statuscustoms';
    private resourceSearchUrl = SERVER_API_URL + 'api/custom/_search/statuscustoms';
    ObjReturned: StatusCustom;
    constructor(private http: Http) { }

    create(statuscustom: StatusCustom): Observable<StatusCustom> {
        const copy = this.convert(statuscustom);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(statuscustom: StatusCustom): Observable<StatusCustom> {
        const copy = this.convert(statuscustom);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: string): Observable<StatusCustom> {
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
     * @returns {StatusCustom}
     * @memberof StatusCustomService
     */
    findByRequest(req?: any): StatusCustom {
        const result = this.search({ query: req });
        // result.subscribe((val) => console.log('val ' + JSON.stringify(val.json)));
        result.subscribe((val) => this.ObjReturned = this.convertItemFromServer(JSON.stringify(val.json)));
        return this.ObjReturned;
    }

    getStatusCustoms():  Promise<StatusCustom[]> {
        return this.http.get(this.resourceUrl)
          .toPromise()
          .then((response) => response.json() as StatusCustom[])
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
     * Convert a returned JSON object to StatusCustom.
     */
    private convertItemFromServer(json: any): StatusCustom {
        const entity: StatusCustom = Object.assign(new StatusCustom(), json);
        return entity;
    }

    /**
     * Convert a StatusCustom to a JSON which can be sent to the server.
     */
    private convert(statuscustom: StatusCustom): StatusCustom {
        const copy: StatusCustom = Object.assign({}, statuscustom);
        return copy;
    }
}
