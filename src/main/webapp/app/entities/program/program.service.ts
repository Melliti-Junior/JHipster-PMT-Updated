import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { Program } from './program.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class ProgramService {

    private resourceUrl =  SERVER_API_URL + 'api/programs';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/programs';

    constructor(private http: Http) { }

    create(program: Program): Observable<Program> {
        const copy = this.convert(program);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(program: Program): Observable<Program> {
        const copy = this.convert(program);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: string): Observable<Program> {
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

    getPrograms():  Promise<Program[]> {
        return this.http.get(this.resourceUrl)
          .toPromise()
          .then((response) => response.json() as Program[])
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
     * Convert a returned JSON object to Program.
     */
    private convertItemFromServer(json: any): Program {
        const entity: Program = Object.assign(new Program(), json);
        return entity;
    }

    /**
     * Convert a Program to a JSON which can be sent to the server.
     */
    private convert(program: Program): Program {
        const copy: Program = Object.assign({}, program);
        return copy;
    }
}
