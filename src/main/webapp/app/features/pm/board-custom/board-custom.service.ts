import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { BoardCustom } from './board-custom.model';
import {createRequestOption, ResponseWrapper} from '../../../shared';

@Injectable()
export class BoardCustomService {

    private resourceUrl =  SERVER_API_URL + 'api/custom/boardcustoms';
    private resourceSearchUrl = SERVER_API_URL + 'api/custom/_search/boardcustoms';

    ObjReturned: BoardCustom;

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    create(boardcustom: BoardCustom): Observable<BoardCustom> {
        const copy = this.convert(boardcustom);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(boardcustom: BoardCustom): Observable<BoardCustom> {
        const copy = this.convert(boardcustom);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: string): Observable<BoardCustom> {
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

    getBoardCustoms():  Promise<BoardCustom[]> {
        return this.http.get(this.resourceUrl)
          .toPromise()
          .then((response) => response.json() as BoardCustom[])
      }

    /**
     *
     * this function return an entity by request
     *
     * @param {*} [req]
     * @returns {Observable<BoardCustom>}
     * @memberof BoardCustomService
     */
    findByRequest(req?: any): BoardCustom {
        const result = this.search({ query: req });
        // result.subscribe((val) => console.log('val ' + JSON.stringify(val.json)));
        result.subscribe((val) => this.ObjReturned = this.convertItemFromServer(JSON.stringify(val.json)));
        return this.ObjReturned;
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
     * Convert a returned JSON ObjReturned to BoardCustom.
     */
    private convertItemFromServer(json: any): BoardCustom {
        const entity: BoardCustom = Object.assign(new BoardCustom(), json);
        return entity;
    }

    /**
     * Convert a Board to a JSON which can be sent to the server.JSON.stringify(val.json)
     */
    private convert(boardcustom: BoardCustom): BoardCustom {
        // Start Conversion
        console.log('Start Conversion');
        // boardcustom.createdDate = new Date().getDate;
        // boardcustom.updatedDate = new Date().getDate;
        // boardcustom.dueDate = new Date().getDate;
        const copy: BoardCustom = Object.assign({}, boardcustom);
        return copy;
    }

}
