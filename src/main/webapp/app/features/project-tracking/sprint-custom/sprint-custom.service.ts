import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../../app.constants';

import {JhiDateUtils} from 'ng-jhipster';

import {SprintCustom} from './sprint-custom.model';
import {createRequestOption, ResponseWrapper} from '../../../shared';

@Injectable()
export class SprintCustomService {

    private resourceUrl =  SERVER_API_URL + 'api/custom/sprintcustoms';
    private resourceSearchUrl = SERVER_API_URL + 'api/custom/_search/sprintcustoms';

    ObjReturned: SprintCustom;

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    create(sprintcustom: SprintCustom): Observable<SprintCustom> {
        const copy = this.convert(sprintcustom);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(sprintcustom: SprintCustom): Observable<SprintCustom> {
        const copy = this.convert(sprintcustom);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: string): Observable<SprintCustom> {
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

    getSprintCustoms():  Promise<SprintCustom[]> {
        return this.http.get(this.resourceUrl)
          .toPromise()
          .then((response) => response.json() as SprintCustom[])
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
     * Convert a returned JSON ObjReturned to SprintCustom.
     */
    private convertItemFromServer(json: any): SprintCustom {

        const entity: SprintCustom = Object.assign(new SprintCustom(), json);
        entity.startDate = this.dateUtils
            .convertLocalDateFromServer(json.startDate);
        entity.endDate = this.dateUtils
            .convertLocalDateFromServer(json.endDate);
        return entity;
        /*
        this.ObjReturned = Object.assign(new SprintCustom(), json);
        this.ObjReturned.startDate = this.dateUtils
            .convertLocalDateFromServer(json.startDate);
        this.ObjReturned.endDate = this.dateUtils
            .convertLocalDateFromServer(json.endDate);
        return this.ObjReturned;
        */
    }

    /**
     * Convert a Sprint to a JSON which can be sent to the server.JSON.stringify(val.json)
     */
    private convert(sprintcustom: SprintCustom): SprintCustom {
        // Start Conversion
        console.log('Start Conversion');
        // sprintcustom.createdDate = new Date().getDate;
        // sprintcustom.updatedDate = new Date().getDate;
        // sprintcustom.dueDate = new Date().getDate;
        const copy: SprintCustom = Object.assign({}, sprintcustom);
        copy.startDate = this.dateUtils
            .convertLocalDateToServer(sprintcustom.startDate);
        console.log('start : ' + copy.startDate);

        copy.endDate = this.dateUtils
            .convertLocalDateToServer(sprintcustom.endDate);
        console.log('end : ' + copy.endDate);

        return copy;
    }

}
