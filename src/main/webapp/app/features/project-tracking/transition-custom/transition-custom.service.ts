import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../../app.constants';

import {JhiDateUtils} from 'ng-jhipster';

import {TransitionCustom} from './transition-custom.model';
import {createRequestOption, ResponseWrapper} from '../../../shared';

@Injectable()
export class TransitionCustomService {

    private resourceUrl =  SERVER_API_URL + 'api/custom/transitioncustoms';
    private resourceSearchUrl = SERVER_API_URL + 'api/custom/_search/transitioncustoms';

    ObjReturned: TransitionCustom;

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    create(transitioncustom: TransitionCustom): Observable<TransitionCustom> {
        const copy = this.convert(transitioncustom);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(transitioncustom: TransitionCustom): Observable<TransitionCustom> {
        const copy = this.convert(transitioncustom);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: string): Observable<TransitionCustom> {
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

    getTransitionCustoms():  Promise<TransitionCustom[]> {
        return this.http.get(this.resourceUrl)
          .toPromise()
          .then((response) => response.json() as TransitionCustom[])
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
     * Convert a returned JSON ObjReturned to TransitionCustom.
     */
    private convertItemFromServer(json: any): TransitionCustom {

        const entity: TransitionCustom = Object.assign(new TransitionCustom(), json);
        return entity;
    }

    /**
     * Convert a Transition to a JSON which can be sent to the server.JSON.stringify(val.json)
     */
    private convert(transitioncustom: TransitionCustom): TransitionCustom {
        const copy: TransitionCustom = Object.assign({}, transitioncustom);
        return copy;
    }

}
