import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { StepCustom } from './step-custom.model';
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

    updateAll(stepcustoms: StepCustom[]): Observable<StepCustom> {
        for (let sp of stepcustoms) {
            let copy = this.convert(sp);
            return this.http.put(this.resourceUrl, copy).map((res: Response) => {
                const jsonResponse = res.json();
                return this.convertItemFromServer(jsonResponse);
            });
        }
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

    /**
     *
     * this function return an entity by request
     *
     * @param {*} [req]
     * @returns {Observable<StepCustom>}
     * @memberof StepCustomService
     */
    findByRequest(req?: any): StepCustom {
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
     * Convert a returned JSON ObjReturned to StepCustom.
     */
    private convertItemFromServer(json: any): StepCustom {

        const entity: StepCustom = Object.assign(new StepCustom(), json);
        return entity;
        /*
        this.ObjReturned = Object.assign(new StepCustom(), json);
        this.ObjReturned.startDate = this.dateUtils
            .convertLocalDateFromServer(json.startDate);
        this.ObjReturned.endDate = this.dateUtils
            .convertLocalDateFromServer(json.endDate);
        return this.ObjReturned;
        */
    }

    /**
     * Convert a Step to a JSON which can be sent to the server.JSON.stringify(val.json)
     */
    private convert(stepcustom: StepCustom): StepCustom {
        // Start Conversion
        console.log('Start Conversion');
        // stepcustom.createdDate = new Date().getDate;
        // stepcustom.updatedDate = new Date().getDate;
        // stepcustom.dueDate = new Date().getDate;
        const copy: StepCustom = Object.assign({}, stepcustom);
        return copy;
    }

}
