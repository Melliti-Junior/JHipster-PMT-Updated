import { Epic } from './../../../entities/epic/epic.model';
import { EpicsService } from './epics.service';
import { Component, OnInit } from '@angular/core';
import { EpicService } from '../../../entities/epic';

@Component({
  selector: 'jhi-epics',
  templateUrl: './epics.component.html',
  styles: ['./epics.component.css']
})
export class EpicsComponent implements OnInit {

    epics: Epic[];

  constructor(private epicsSce: EpicsService, private epsSce: EpicService) { }

  ngOnInit() {
      this.getTodos();
  }

    getTodos(): void {
        // this.epicsSce.getEpics()
            // .then( (epics) => this.epics = epics );
            this.epsSce.find('5a9fa964993def10049e12c1');
    }
/*
    createTodo( todoForm: NgForm ): void {
        this.todoService.createTodo( this.newTodo )
            .then( createTodo => {
                todoForm.reset();
                this.newTodo = new Todo();
                this.todos.unshift( createTodo )
            } );
    }

    deleteTodo( id: string ): void {
        this.todoService.deleteTodo( id )
            .then(() => {
                this.todos = this.todos.filter( todo => todo.id != id );
            } );
    }

    updateTodo( todoData: Todo ): void {
        console.log( todoData );
        this.todoService.updateTodo( todoData )
            .then( updatedTodo => {
                let existingTodo = this.todos.find( todo => todo.id === updatedTodo.id );
                Object.assign( existingTodo, updatedTodo );
                this.clearEditing();
            } );
    }
*/
}
