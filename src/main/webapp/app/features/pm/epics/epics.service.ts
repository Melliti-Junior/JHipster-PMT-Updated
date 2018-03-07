import { Epic } from './../../../entities/epic/epic.model';
import { EpicService } from './../../../entities/epic/epic.service';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { SERVER_API_URL } from '../../../app.constants';

@Injectable()
export class EpicsService {

    private baseUrl = SERVER_API_URL;

    constructor( private http: Http, private epicSce: EpicService ) { }

    getEpics(): Promise<Epic[]> {
        return this.http.get( this.baseUrl + 'api/epics' )
            .toPromise()
            .then( (response) => response.json() as Epic[] )
            .catch( this.handleError );
    }

    /*
    createTodo( todoData: Todo ): Promise<Todo> {
        return this.http.post( this.baseUrl + '/api/todos/', todoData )
            .toPromise().then( response => response.json() as Todo )
            .catch( this.handleError );
    }

    updateTodo( todoData: Todo ): Promise<Todo> {
        return this.http.put( this.baseUrl + '/api/todos/' + todoData.id, todoData )
            .toPromise()
            .then( response => response.json() as Todo )
            .catch( this.handleError );
    }

    deleteTodo( id: string ): Promise<any> {
        return this.http.delete( this.baseUrl + '/api/todos/' + id )
            .toPromise()
            .catch( this.handleError );
    }

    */

    private handleError( error: any ): Promise<any> {
        console.error( 'Some error occured', error );
        return Promise.reject( error.message || error );
    }
}
