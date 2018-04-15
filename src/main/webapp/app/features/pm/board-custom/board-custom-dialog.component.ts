import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import {BoardCustom} from './board-custom.model';
import { BoardCustomPopupService } from './board-custom-popup.service';
import { BoardCustomService } from './board-custom.service';
import { BoardCustomComponent } from './board-custom.component';
import 'rxjs/add/observable/throw';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { ProjectCustom } from '../project-custom';
import { ProjectCustomService } from '../project-custom/project-custom.service';
import {IssueCustom} from '../issue-custom';

@Component({
    selector: 'jhi-board-custom-dialog',
    templateUrl: './board-custom-dialog.component.html',
    providers: [BoardCustomComponent ],
})
export class BoardCustomDialogComponent implements OnInit {

    boardcustom: BoardCustom;
    isSaving: boolean;
    createdDateDp: any;
    dueDateDp: any;

    projects: ProjectCustom[];
    project_issues: IssueCustom[];
    boardCustoms: BoardCustom[];

    // Get the project related to this board
    parentProject: ProjectCustom;
    // Get the projectname chosen from list (combobox)
    projectname: string;
    // projectcode: string;

    numBoardsParentProj: number;

    constructor(
        public activeModal: NgbActiveModal,
        private boardcustomService: BoardCustomService,
        private eventManager: JhiEventManager,
        private projectSce: ProjectCustomService,
        // private comp: BoardCustomComponent
    ) {
        // To check ----
        // this.boardcustom = new BoardCustom();
    }

    ngOnInit() {
        this.isSaving = false;
        this.loadAttributes();
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    findProject() {
        let index = 0;
        let found = false;
        while (index < this.projects.length && found === false)  {
            if ((this.projects[index]).name === this.projectname) {
                found = true;
                this.parentProject = this.projects[index];
                // this.projectcode = this.projects[index].code;
                this.boardcustom.project = this.projects[index];
            } else {
                index = index + 1;
            }
        }
        console.log('aff' + this.boardcustom.project.name);

        this.numBoardsParentProj = 0;
        // tslint:disable-next-line:prefer-const
        for (let board of this.boardCustoms) {
            if ((board.project !== null) && (board.project.code === this.parentProject.code)) {
                this.numBoardsParentProj++;
            }
        }
        console.log('Num' + this.numBoardsParentProj + this.parentProject.code);
    }

    /**
     * This function retrieves all existing Epics, Types and Priorities
     *
     * @private
     * @memberof BoardCustomDialogComponent
     */
    private loadAttributes() {
        this.projectSce.getProjects()
        .then((projects) => this.projects = projects );
        this.boardcustomService.getBoardCustoms()
        .then((boardCustoms) => this.boardCustoms = boardCustoms );
    }

    /**
     * Use ElasticSearch to find element by request
     *
     * @param {string} req
     * @memberof BoardCustomDialogComponent
     */
    findByname(name: string) {
        this.boardcustomService.findByRequest(name);
        // console.log(this.comp.boardcustoms);
    }

    save() {
        this.isSaving = true;
        if (this.boardcustom.id !== undefined) {
            this.subscribeToSaveResponse(
                this.boardcustomService.update(this.boardcustom));
        } else {
            this.subscribeToSaveResponse(
                this.boardcustomService.create(this.boardcustom));
        }
    }

    private subscribeToSaveResponse(result: Observable<BoardCustom>) {
        result.subscribe((res: BoardCustom) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: BoardCustom) {
        this.eventManager.broadcast({ name: 'boardcustomsListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

}

@Component({
    selector: 'jhi-board-custom-popup',
    template: ''
})
export class BoardCustomPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private boardcustomPopupService: BoardCustomPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.boardcustomPopupService
                    .open(BoardCustomDialogComponent as Component, params['id']);
            } else {
                this.boardcustomPopupService
                    .open(BoardCustomDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
