import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../../app.constants';

import {JhiDateUtils} from 'ng-jhipster';

import {createRequestOption, ResponseWrapper} from '../../../shared';
import {ProjectCustom} from './project-custom.model';

@Injectable()
export class ProjectCustomService {

    private resourceUrl =  SERVER_API_URL + 'api/custom/projectcustoms';
    private resourceSearchUrl = SERVER_API_URL + 'api/custom/_search/projectcustoms';

    ObjReturned: ProjectCustom;

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    create(projectcustom: ProjectCustom): Observable<ProjectCustom> {
        const copy = this.convert(projectcustom);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(projectcustom: ProjectCustom): Observable<ProjectCustom> {
        const copy = this.convert(projectcustom);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: string): Observable<ProjectCustom> {
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

    getProjects():  Promise<ProjectCustom[]> {
        return this.http.get(this.resourceUrl)
          .toPromise()
          .then((response) => response.json() as ProjectCustom[])
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
     * Convert a returned JSON object to ProjectCustom.
     */
    private convertItemFromServer(json: any): ProjectCustom {
        this.ObjReturned = Object.assign(new ProjectCustom(), json);
        this.ObjReturned.startDate = this.dateUtils
            .convertLocalDateFromServer(json.startDate);
            this.ObjReturned.endDate = this.dateUtils
            .convertLocalDateFromServer(json.endDate);
        return this.ObjReturned;
    }

    /**
     * Convert a ProjectCustom to a JSON which can be sent to the server.
     */
    private convert(projectcustom: ProjectCustom): ProjectCustom {
        const copy: ProjectCustom = Object.assign({}, projectcustom);
        copy.startDate = this.dateUtils
            .convertLocalDateToServer(projectcustom.startDate);
        copy.endDate = this.dateUtils
            .convertLocalDateToServer(projectcustom.endDate);
        return copy;
    }
}
