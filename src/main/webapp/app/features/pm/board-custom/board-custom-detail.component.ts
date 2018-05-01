import {Component, OnInit, OnDestroy, AfterViewInit, AfterContentInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { BoardCustom } from './board-custom.model';
import { BoardCustomService } from './board-custom.service';
import {IssueCustom} from '../issue-custom/issue-custom.model';
import {IssueCustomService} from '../issue-custom/issue-custom.service';
import {SprintCustom} from '../sprint-custom/sprint-custom.model';
import {SprintCustomService} from '../sprint-custom/sprint-custom.service';
import {Observable} from 'rxjs/Observable';
import {Response} from '@angular/http';
import {NgbActiveModal, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {ResponseWrapper} from '../../../shared';
import {ColumnCustom} from '../column-custom/column-custom.model';
import {ColumnCustomService} from '../column-custom/column-custom.service';
import {MenuItem} from 'primeng/api';
import {StatusCustom} from '../status-custom/status-custom.model';
import {StatusCustomService} from '../status-custom/status-custom.service';

@Component({
    selector: 'jhi-board-custom-detail',
    templateUrl: './board-custom-detail.component.html',
    styleUrls: ['./board-custom-detail.component.css']
})
export class BoardCustomDetailComponent implements OnInit, OnDestroy, AfterContentInit {

    boardcustom: BoardCustom;
    activeSprint: SprintCustom;

    isSaving: boolean;

    issueCustoms: IssueCustom[] = new Array<IssueCustom>();
    relatedColumns: ColumnCustom[];
    relatedStatuses: StatusCustom[];
    relatedSprints: SprintCustom[];

    sprintCustoms: SprintCustom[];
    columnCustoms: ColumnCustom[];
    statusCustoms: StatusCustom[];

    private subscription: Subscription;
    private eventSubscriber: Subscription;

    totalItems: any;

    theDate: NgbDateStruct;
    now = new Date();

    boardItems: MenuItem[];

    myColumns = false;
    myStatuses = false;
    mySprints = false;

    constructor(
        private eventManager: JhiEventManager,
        private boardcustomSce: BoardCustomService,
        private route: ActivatedRoute,
        private issuecustomSce: IssueCustomService,
        private sprintcustomSce: SprintCustomService,
        private columncustomSce: ColumnCustomService,
        private statuscustomSce: StatusCustomService,
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInBoardCustoms();
        this.loadAttributes();
        this.theDate = {year: this.now.getFullYear(), month: this.now.getMonth() + 1, day: this.now.getDate()};
        // this.getBacklogIssues();
        this.boardItems = [
            {
                label: 'Columns', icon: 'fa-tasks', command: (onclick) => {
                    this.myColumns = true;
                    this.myStatuses = false;
                    this.mySprints = false;
                    this.searchRelatedColumns();
                }},
            {
                label: 'Statuses', icon: 'fa-table', command: (onclick) => {
                    this.myColumns = false;
                    this.myStatuses = true;
                    this.mySprints = false;
                    this.searchRelatedStatuses();
                }},
            {
                label: 'Sprints', icon: 'fa-table', command: (onclick) => {
                    this.myColumns = false;
                    this.myStatuses = false;
                    this.mySprints = true;
                    this.searchRelatedSprints();
                }},
        ];

        setTimeout(() => {
            if (this.boardcustom) {
                this.myColumns = true;
            }
            this.searchRelatedColumns();
            this.searchRelatedStatuses();
            this.searchRelatedSprints();
        }, 100);
    }

    ngAfterContentInit() {
        console.log('finish');
        // this.getBacklogIssues();
        // let BacklogBtnID = document.getElementById('backlog').click();
    }

    load(id) {
        this.boardcustomSce.find(id).subscribe((boardcustom) => {
            this.boardcustom = boardcustom;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInBoardCustoms() {
        this.eventSubscriber = this.eventManager.subscribe(
            'boardcustomListModification',
            (response) => this.load(this.boardcustom.id)
        );
    }

    private loadAttributes() {
        this.getAllIssues();
        this.getAllSprints();
        this.getAllColumns();
        this.getAllStatuses();
    }

    searchRelatedColumns() {
        // this.getBacklogIssues();
        // this.getSprintIssues();
        this.relatedColumns = new Array<ColumnCustom>();
        for (let col of this.columnCustoms) {
            if (col.board.code.toLowerCase() === this.boardcustom.code.toLowerCase()) {
                if (this.relatedColumns.indexOf(col) === -1) {
                    this.relatedColumns.push(col);
                }
            }
        }
        console.log(this.relatedColumns.length);
    }

    searchRelatedStatuses() {
        this.searchRelatedColumns();
        this.relatedStatuses = new Array<StatusCustom>();
        for (let col of this.relatedColumns) {
            for (let status of this.statusCustoms){
                if ((status.column && status.column.id === col.id)) {
                    if (this.relatedStatuses.indexOf(status) === -1) {
                        this.relatedStatuses.push(status);
                    }
                }
            }
        }
    }

    searchRelatedSprints() {
        this.sprintcustomSce.search({query : this.boardcustom.id})
            .subscribe(
                (res: ResponseWrapper) => this.getRelatedSprints(res.json),
                (error) => console.log(error))
    }

    private getRelatedSprints(data) {
        this.relatedSprints = data.valueOf();
        console.log(this.relatedSprints.length);

        if (this.relatedSprints.length) {
            this.getActiveSprint();
        }
    }

    getActiveSprint() {
        for (let sp of this.relatedSprints) {
            if (sp.isActive) {
                this.activeSprint = sp;
            }
        }
    }

    getAllIssues() {
        this.issuecustomSce.getIssueCustoms()
            .then((issueCustoms) => this.issueCustoms = issueCustoms );
    }

    getAllSprints() {
        this.sprintcustomSce.getSprintCustoms()
            .then((sprintCustoms) => this.sprintCustoms = sprintCustoms );
    }

    getAllColumns() {
        this.columncustomSce.getColumnCustoms()
            .then((columnCustoms) => this.columnCustoms = columnCustoms );
    }

    getAllStatuses() {
        this.statuscustomSce.getStatusCustoms()
            .then((statusCustoms) => this.statusCustoms = statusCustoms );
    }

    private subscribeToSaveResponse(result: Observable<BoardCustom>) {
        result.subscribe((res: BoardCustom) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: BoardCustom) {
        this.eventManager.broadcast({ name: 'sprintcustomsListModification', content: 'OK'});
        this.isSaving = false;
    }

    private onSaveError() {
        this.isSaving = false;
    }

}
