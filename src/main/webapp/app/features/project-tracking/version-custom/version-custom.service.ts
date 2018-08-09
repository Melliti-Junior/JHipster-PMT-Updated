import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../../app.constants';

import {JhiDateUtils} from 'ng-jhipster';

import {VersionCustom} from './version-custom.model';
import {createRequestOption, ResponseWrapper} from '../../../shared';

@Injectable()
export class VersionCustomService {

    private resourceUrl =  SERVER_API_URL + 'api/custom/versioncustoms';
    private resourceSearchUrl = SERVER_API_URL + 'api/custom/_search/versioncustoms';

    ObjReturned: VersionCustom;

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    create(versioncustom: VersionCustom): Observable<VersionCustom> {
        const copy = this.convert(versioncustom);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(versioncustom: VersionCustom): Observable<VersionCustom> {
        const copy = this.convert(versioncustom);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: string): Observable<VersionCustom> {
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

    getVersionCustoms():  Promise<VersionCustom[]> {
        return this.http.get(this.resourceUrl)
          .toPromise()
          .then((response) => response.json() as VersionCustom[])
      }

    /**
     *
     * this function return an entity by request
     *
     * @param {*} [req]
     * @returns {Observable<VersionCustom>}
     * @memberof VersionCustomService
     */
    findByRequest(req?: any): VersionCustom {
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
     * Convert a returned JSON ObjReturned to VersionCustom.
     */
    private convertItemFromServer(json: any): VersionCustom {
        this.ObjReturned = Object.assign(new VersionCustom(), json);
        this.ObjReturned.startDate = this.dateUtils
            .convertLocalDateFromServer(json.startDate);
        this.ObjReturned.releaseDate = this.dateUtils
            .convertLocalDateFromServer(json.releaseDate);
        return this.ObjReturned;
    }

    /**
     * Convert a Version to a JSON which can be sent to the server.JSON.stringify(val.json)
     */
    private convert(versioncustom: VersionCustom): VersionCustom {
        // Start Conversion
        console.log('Start Conversion');
        // versioncustom.createdDate = new Date().getDate;
        // versioncustom.updatedDate = new Date().getDate;
        // versioncustom.dueDate = new Date().getDate;
        const copy: VersionCustom = Object.assign({}, versioncustom);
        copy.startDate = this.dateUtils
            .convertLocalDateToServer(versioncustom.startDate);
        copy.releaseDate = this.dateUtils
            .convertLocalDateToServer(versioncustom.releaseDate);
        return copy;
    }

}
