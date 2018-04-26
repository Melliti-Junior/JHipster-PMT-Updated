import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { Column } from './column.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class ColumnService {

    private resourceUrl =  SERVER_API_URL + 'api/columns';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/columns';

    constructor(private http: Http) { }

    create(column: Column): Observable<Column> {
        const copy = this.convert(column);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(column: Column): Observable<Column> {
        const copy = this.convert(column);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: string): Observable<Column> {
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
     * Convert a returned JSON object to Column.
     */
    private convertItemFromServer(json: any): Column {
        const entity: Column = Object.assign(new Column(), json);
        return entity;
    }

    /**
     * Convert a Column to a JSON which can be sent to the server.
     */
    private convert(column: Column): Column {
        const copy: Column = Object.assign({}, column);
        return copy;
    }
}
