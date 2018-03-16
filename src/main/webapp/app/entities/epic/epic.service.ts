import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { Epic } from './epic.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class EpicService {

    private resourceUrl =  SERVER_API_URL + 'api/epics';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/epics';

    ObjReturned: Epic;

    constructor(private http: Http) { }

    create(epic: Epic): Observable<Epic> {
        const copy = this.convert(epic);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(epic: Epic): Observable<Epic> {
        const copy = this.convert(epic);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: string): Observable<Epic> {
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
     * @returns {Epic}
     * @memberof EpicService
     */
    findByRequest(req?: any): Epic {
        const result = this.search({ query: req });
        // result.subscribe((val) => console.log('val ' + JSON.stringify(val.json)));
        // result.subscribe((val) => this.ObjReturned = this.convertItemFromServer(JSON.stringify(val.json)));
        result.subscribe((val) => this.ObjReturned = JSON.parse(JSON.stringify(val.json)));
        console.log(JSON.stringify(this.ObjReturned));
        return this.ObjReturned;
    }

    getEpics():  Promise<Epic[]> {
        return this.http.get(this.resourceUrl)
          .toPromise()
          .then((response) => response.json() as Epic[])
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
     * Convert a returned JSON object to Epic.
     */
    private convertItemFromServer(json: any): Epic {
        this.ObjReturned = Object.assign(new Epic(), json);
        return this.ObjReturned;
    }

    /**
     * Convert a Epic to a JSON which can be sent to the server.
     */
    private convert(epic: Epic): Epic {
        const copy: Epic = Object.assign({}, epic);
        return copy;
    }
}
