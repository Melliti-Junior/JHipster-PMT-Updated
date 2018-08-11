import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../../app.constants';

import {JhiDateUtils} from 'ng-jhipster';

import {IssueCustom} from './issue-custom.model';
import {createRequestOption, ResponseWrapper} from '../../../shared';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class IssueCustomService {

    private resourceUrl =  SERVER_API_URL + 'api/custom/issuecustoms';
    private resourceSearchUrl = SERVER_API_URL + 'api/custom/_search/issuecustoms';

    ObjReturned: IssueCustom;
    theDate: NgbDateStruct;
    now = new Date();

    constructor(private http: Http, private dateUtils: JhiDateUtils) {
        this.theDate = {year: this.now.getFullYear(), month: this.now.getMonth() + 1, day: this.now.getDate()};
    }

    create(issuecustom: IssueCustom): Observable<IssueCustom> {
        issuecustom.createdDate = this.theDate;
        const copy = this.convert(issuecustom);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(issuecustom: IssueCustom): Observable<IssueCustom> {
        issuecustom.updatedDate = this.theDate;
        const copy = this.convert(issuecustom);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: string): Observable<IssueCustom> {
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

    getIssueCustoms():  Promise<IssueCustom[]> {
        return this.http.get(this.resourceUrl)
          .toPromise()
          .then((response) => response.json() as IssueCustom[])
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
     * Convert a returned JSON ObjReturned to CustomIssue.
     */
    private convertItemFromServer(json: any): IssueCustom {
        const entity: IssueCustom = Object.assign(new IssueCustom(), json);
        entity.createdDate = this.dateUtils
            .convertLocalDateFromServer(json.createdDate);
        entity.dueDate = this.dateUtils
            .convertLocalDateFromServer(json.dueDate);
        entity.updatedDate = this.dateUtils
            .convertLocalDateFromServer(json.updatedDate);
        return entity;
    }

    /**
     * Convert a Issue to a JSON which can be sent to the server.JSON.stringify(val.json)
     */
    private convert(issuecustom: IssueCustom): IssueCustom {
        const copy: IssueCustom = Object.assign({}, issuecustom);
       if (copy.id === undefined) {
            console.log('creation');
       } else {
            console.log('update');
       }
        console.log('Created : ' + copy.createdDate);
        copy.createdDate = this.dateUtils
            .convertLocalDateToServer(issuecustom.createdDate);

        console.log('Updated : ' + copy.updatedDate);
        copy.updatedDate = this.dateUtils
            .convertLocalDateToServer(issuecustom.updatedDate);

        console.log('Due : ' + copy.dueDate);
        copy.dueDate = this.dateUtils
            .convertLocalDateToServer(issuecustom.dueDate);
        return copy;
    }

}
