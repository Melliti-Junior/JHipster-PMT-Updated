import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import {NgbActiveModal, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { SprintCustom } from './sprint-custom.model';
import { SprintCustomPopupService } from './sprint-custom-popup.service';
import { SprintCustomService } from './sprint-custom.service';
import { SprintCustomComponent } from './sprint-custom.component';
import 'rxjs/add/observable/throw';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { BoardCustom } from '../board-custom';
import { BoardCustomService } from '../board-custom/board-custom.service';
import {IssueCustom} from '../issue-custom';

@Component({
    selector: 'jhi-sprint-custom-dialog',
    templateUrl: './sprint-custom-dialog.component.html',
    providers: [SprintCustomComponent ],
})
export class SprintCustomDialogComponent implements OnInit {

    sprintcustom: SprintCustom;
    isSaving: boolean;
    startDateDp: any;
    endDateDp: any;

    boards: BoardCustom[];
    scrumboards: BoardCustom[];
    board_issues: IssueCustom[];
    sprintCustoms: SprintCustom[];

    // Get the board related to this sprint
    parentBoard: BoardCustom;
    // Get the boardname chosen from list (combobox)
    boardname: string;
    // boardcode: string;

    numSprintsParentBoard: number;

    now = new Date();

    constructor(
        public activeModal: NgbActiveModal,
        private sprintcustomService: SprintCustomService,
        private eventManager: JhiEventManager,
        private boardSce: BoardCustomService,
        // private comp: ColumnCustomComponent
    ) {
        this.scrumboards = new Array<BoardCustom>();
    }

    ngOnInit() {
        this.isSaving = false;
        this.loadAttributes();
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    findBoard() {
        let index = 0;
        let found = false;

        while (index < this.boards.length && found === false)  {
            if ((this.boards[index]).name === this.boardname) {
                found = true;
                this.parentBoard = this.boards[index]
                console.log('parentboard' + this.boards[index].type)
                // this.boardcode = this.boards[index].code;
                this.sprintcustom.board = this.boards[index];
            } else {
                index = index + 1;
            }
        }
        console.log('aff' + this.sprintcustom.board.name);

        this.numSprintsParentBoard = 0;
        // tslint:disable-next-line:prefer-const
        for (let sprint of this.sprintCustoms) {
            if ((sprint.board !== null) && (sprint.board.code === this.parentBoard.code)) {
                this.numSprintsParentBoard++;
            }
        }
        console.log('Num' + this.numSprintsParentBoard + this.parentBoard.code);
    }

    setEndDate() {
        let endDate = new Date();
        if (this.sprintcustom.startDate !== null) {
            this.sprintcustom.endDate = {
                year: this.sprintcustom.startDate.getToday().getFullYear(),
                month: this.sprintcustom.startDate.getToday().getMonth() + 1,
                day: this.sprintcustom.startDate.getToday().getDate() + (this.sprintcustom.duration * 7)
            };
            console.log(this.sprintcustom.endDate);
        } else {
            console.log('start Date null');
        }
    }
    /**
     * This function retrieves all existing Epics, Types and Priorities
     *
     * @private
     * @memberof SprintCustomDialogComponent
     */
    private loadAttributes() {
        this.boardSce.getBoardCustoms()
        .then((boards) => this.boards = boards );
        this.sprintcustomService.getSprintCustoms()
        .then((sprintCustoms) => this.sprintCustoms = sprintCustoms );
    }

    /**
     * Use ElasticSearch to find element by request
     *
     * @param {string} req
     * @memberof SprintCustomDialogComponent
     */
    findByname(name: string) {
        this.sprintcustomService.findByRequest(name);
        // console.log(this.comp.sprintcustoms);
    }

    save() {
        this.isSaving = true;
        if (this.sprintcustom.id !== undefined) {
            this.subscribeToSaveResponse(
                this.sprintcustomService.update(this.sprintcustom));
        } else {
            // Activate last created Sprint by default
            // this.sprintcustom.isActive = true;
            this.subscribeToSaveResponse(
                this.sprintcustomService.create(this.sprintcustom));
        }
    }

    private subscribeToSaveResponse(result: Observable<SprintCustom>) {
        result.subscribe((res: SprintCustom) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: SprintCustom) {
        this.eventManager.broadcast({ name: 'sprintcustomsListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

}

@Component({
    selector: 'jhi-sprint-custom-popup',
    template: ''
})
export class SprintCustomPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private sprintcustomPopupService: SprintCustomPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.sprintcustomPopupService
                    .open(SprintCustomDialogComponent as Component, params['id']);
            } else {
                this.sprintcustomPopupService
                    .open(SprintCustomDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
