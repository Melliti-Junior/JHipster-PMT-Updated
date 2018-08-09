import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../../app.constants';

import {CategoryCustom} from './category-custom.model';
import {createRequestOption, ResponseWrapper} from '../../../shared/index';

@Injectable()
export class CategoryCustomService {

    private resourceUrl =  SERVER_API_URL + 'api/custom/categorycustoms';
    private resourceSearchUrl = SERVER_API_URL + 'api/custom/_search/categorycustoms';
    ObjReturned: CategoryCustom;
    constructor(private http: Http) { }

    create(categorycustom: CategoryCustom): Observable<CategoryCustom> {
        const copy = this.convert(categorycustom);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(categorycustom: CategoryCustom): Observable<CategoryCustom> {
        // console.error('start put func : ' + categorycustom.column.name)
        const copy = this.convert(categorycustom);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: string): Observable<CategoryCustom> {
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

    getCategoryCustoms():  Promise<CategoryCustom[]> {
        return this.http.get(this.resourceUrl)
          .toPromise()
          .then((response) => response.json() as CategoryCustom[])
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
     * Convert a returned JSON object to CategoryCustom.
     */
    private convertItemFromServer(json: any): CategoryCustom {
        const entity: CategoryCustom = Object.assign(new CategoryCustom(), json);
        return entity;
    }

    /**
     * Convert a CategoryCustom to a JSON which can be sent to the server.
     */
    private convert(categorycustom: CategoryCustom): CategoryCustom {
        const copy: CategoryCustom = Object.assign({}, categorycustom);
        return copy;
    }
}
