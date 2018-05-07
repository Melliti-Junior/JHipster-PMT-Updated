import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { ResolutionCustom } from './resolution-custom.model';
import { ResponseWrapper, createRequestOption } from '../../../shared';
import { ResolutionComponent } from '../../../entities/resolution/resolution.component';

@Injectable()
export class ResolutionCustomService {

    private resourceUrl =  SERVER_API_URL + 'api/custom/resolutioncustoms';
    private resourceSearchUrl = SERVER_API_URL + 'api/custom/_search/resolutioncustoms';

    ObjReturned: ResolutionCustom;

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    create(resolutioncustom: ResolutionCustom): Observable<ResolutionCustom> {
        const copy = this.convert(resolutioncustom);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(resolutioncustom: ResolutionCustom): Observable<ResolutionCustom> {
        const copy = this.convert(resolutioncustom);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: string): Observable<ResolutionCustom> {
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

    getResolutionCustoms():  Promise<ResolutionCustom[]> {
        return this.http.get(this.resourceUrl)
          .toPromise()
          .then((response) => response.json() as ResolutionCustom[])
      }

    /**
     *
     * this function return an entity by request
     *
     * @param {*} [req]
     * @returns {Observable<ResolutionCustom>}
     * @memberof ResolutionCustomService
     */
    findByRequest(req?: any): ResolutionCustom {
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
     * Convert a returned JSON ObjReturned to ResolutionCustom.
     */
    private convertItemFromServer(json: any): ResolutionCustom {
        this.ObjReturned = Object.assign(new ResolutionCustom(), json);
        return this.ObjReturned;
    }

    /**
     * Convert a Resolution to a JSON which can be sent to the server.JSON.stringify(val.json)
     */
    private convert(resolutioncustom: ResolutionCustom): ResolutionCustom {
        // Start Conresolution
        console.log('Start Conresolution');
        // resolutioncustom.createdDate = new Date().getDate;
        // resolutioncustom.updatedDate = new Date().getDate;
        // resolutioncustom.dueDate = new Date().getDate;
        const copy: ResolutionCustom = Object.assign({}, resolutioncustom);
        return copy;
    }

}
