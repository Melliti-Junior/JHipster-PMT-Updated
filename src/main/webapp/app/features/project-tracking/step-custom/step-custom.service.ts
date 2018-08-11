import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../../app.constants';

import {JhiDateUtils} from 'ng-jhipster';

import {StepCustom} from './step-custom.model';
import {createRequestOption, ResponseWrapper} from '../../../shared';

@Injectable()
export class StepCustomService {

    private resourceUrl =  SERVER_API_URL + 'api/custom/stepcustoms';
    private resourceSearchUrl = SERVER_API_URL + 'api/custom/_search/stepcustoms';

    ObjReturned: StepCustom;

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    create(stepcustom: StepCustom): Observable<StepCustom> {
        const copy = this.convert(stepcustom);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(stepcustom: StepCustom): Observable<StepCustom> {
        const copy = this.convert(stepcustom);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: string): Observable<StepCustom> {
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

    getStepCustoms():  Promise<StepCustom[]> {
        return this.http.get(this.resourceUrl)
          .toPromise()
          .then((response) => response.json() as StepCustom[])
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
     * Convert a returned JSON ObjReturned to CustomStep.
     */
    private convertItemFromServer(json: any): StepCustom {
        const entity: StepCustom = Object.assign(new StepCustom(), json);
        return entity;
    }

    /**
     * Convert a Step to a JSON which can be sent to the server.JSON.stringify(val.json)
     */
    private convert(stepcustom: StepCustom): StepCustom {
        console.log('Start Conversion');
        const copy: StepCustom = Object.assign({}, stepcustom);
        return copy;
    }

}
