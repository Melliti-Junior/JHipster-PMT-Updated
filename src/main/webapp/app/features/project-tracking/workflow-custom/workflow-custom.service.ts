import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../../app.constants';

import {JhiDateUtils} from 'ng-jhipster';

import {WorkflowCustom} from './workflow-custom.model';
import {createRequestOption, ResponseWrapper} from '../../../shared';

@Injectable()
export class WorkflowCustomService {

    private resourceUrl =  SERVER_API_URL + 'api/custom/workflowcustoms';
    private resourceSearchUrl = SERVER_API_URL + 'api/custom/_search/workflowcustoms';

    ObjReturned: WorkflowCustom;

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    create(workflowcustom: WorkflowCustom): Observable<WorkflowCustom> {
        const copy = this.convert(workflowcustom);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(workflowcustom: WorkflowCustom): Observable<WorkflowCustom> {
        const copy = this.convert(workflowcustom);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    updateAll(workflowcustoms: WorkflowCustom[]): Observable<WorkflowCustom> {
        for (let sp of workflowcustoms) {
            let copy = this.convert(sp);
            return this.http.put(this.resourceUrl, copy).map((res: Response) => {
                const jsonResponse = res.json();
                return this.convertItemFromServer(jsonResponse);
            });
        }
    }

    find(id: string): Observable<WorkflowCustom> {
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

    getWorkflowCustoms():  Promise<WorkflowCustom[]> {
        return this.http.get(this.resourceUrl)
          .toPromise()
          .then((response) => response.json() as WorkflowCustom[])
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
     * Convert a returned JSON ObjReturned to WorkflowCustom.
     */
    private convertItemFromServer(json: any): WorkflowCustom {

        const entity: WorkflowCustom = Object.assign(new WorkflowCustom(), json);
        return entity;
        /*
        this.ObjReturned = Object.assign(new WorkflowCustom(), json);
        this.ObjReturned.startDate = this.dateUtils
            .convertLocalDateFromServer(json.startDate);
        this.ObjReturned.endDate = this.dateUtils
            .convertLocalDateFromServer(json.endDate);
        return this.ObjReturned;
        */
    }

    /**
     * Convert a Workflow to a JSON which can be sent to the server.JSON.stringify(val.json)
     */
    private convert(workflowcustom: WorkflowCustom): WorkflowCustom {
        // Start Conversion
        console.log('Start Conversion');
        // workflowcustom.createdDate = new Date().getDate;
        // workflowcustom.updatedDate = new Date().getDate;
        // workflowcustom.dueDate = new Date().getDate;
        const copy: WorkflowCustom = Object.assign({}, workflowcustom);
        return copy;
    }

}
