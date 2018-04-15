import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { IssueCustom } from './issue-custom.model';
import { ResponseWrapper, createRequestOption } from '../../../shared';
import { IssueTypeService } from '../../../entities/issue-type/issue-type.service';
import { IssuePriorityService } from '../../../entities/issue-priority';
import { IssueComponent } from '../../../entities/issue/issue.component';

@Injectable()
export class IssueCustomService {

    private resourceUrl =  SERVER_API_URL + 'api/custom/issuecustoms';
    private resourceSearchUrl = SERVER_API_URL + 'api/custom/_search/issuecustoms';

    ObjReturned: IssueCustom;

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    create(issuecustom: IssueCustom): Observable<IssueCustom> {
        const copy = this.convert(issuecustom);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(issuecustom: IssueCustom): Observable<IssueCustom> {
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

    /**
     *
     * this function return an entity by request
     *
     * @param {*} [req]
     * @returns {Observable<IssueCustom>}
     * @memberof IssueCustomService
     */
    findByRequest(req?: any): IssueCustom {
        const result = this.search({ query: req });
        // result.subscribe((val) => console.log('val ' + JSON.stringify(val.json)));
        result.subscribe((val) => this.ObjReturned = this.convertItemFromServer(JSON.stringify(val.json)));
        console.log('typeof' + this.ObjReturned.priority.name);
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
     * Convert a returned JSON ObjReturned to IssueCustom.
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
        // Start Conversion
        console.log('Start Conversion');
        // issuecustom.createdDate = new Date().getDate;
        // issuecustom.updatedDate = new Date().getDate;
        // issuecustom.dueDate = new Date().getDate;
        const copy: IssueCustom = Object.assign({}, issuecustom);
       if (copy.id === undefined) {
            console.log('creation');
           // copy.updatedDate = Object.assign(copy.updatedDate);
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
            /*
        if (copy.createdDate !== undefined) {
            if (copy.createdDate.valid) {
                console.log('Created : ' + issuecustom.createdDate);
                copy.createdDate = this.dateUtils
                    .convertLocalDateToServer(issuecustom.createdDate);
            }
        } else {
            console.error('Invalid Date : createdDate')
        }
        if (copy.dueDate !== undefined) {
            if (copy.dueDate.valid) {
                console.log('Due : ' + issuecustom.dueDate);
                copy.dueDate = this.dateUtils
                    .convertLocalDateToServer(issuecustom.dueDate);
            }
        } else {
            console.error('Invalid Date : dueDate')
        }
        if (copy.updatedDate !== undefined) {
            if (copy.updatedDate.valid) {
                console.log('Updated : ' + issuecustom.updatedDate);
                copy.updatedDate = this.dateUtils
                    .convertLocalDateToServer(issuecustom.updatedDate);
                return copy;
            }
        } else {
            console.error('Invalid Date : updatedDate')
        }
        */
        return copy;
    }

}
