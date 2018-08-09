import {AfterContentInit, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {JhiEventManager} from 'ng-jhipster';

import {BoardCustom} from './board-custom.model';
import {BoardCustomService} from './board-custom.service';
import {IssueCustom} from '../issue-custom/issue-custom.model';
import {IssueCustomService} from '../issue-custom/issue-custom.service';
import {SprintCustom} from '../sprint-custom/sprint-custom.model';
import {SprintCustomService} from '../sprint-custom/sprint-custom.service';
import {ColumnCustom} from '../column-custom/column-custom.model';
import {ColumnCustomService} from '../column-custom/column-custom.service';
import {StepCustom} from '../step-custom/step-custom.model';
import {StepCustomService} from '../step-custom/step-custom.service';

import {Observable} from 'rxjs/Observable';
import {Response} from '@angular/http';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {ResponseWrapper} from '../../../shared';

import {MenuItem} from 'primeng/api';

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
    relatedStepsForCol: StepCustom[];
    relatedStepsForBoard: StepCustom[];
    relatedSteps: StepCustom[];
    relatedSprints: SprintCustom[];

    sprintCustoms: SprintCustom[];
    columnCustoms: ColumnCustom[];
    stepCustoms: StepCustom[];

    private subscription: Subscription;
    private eventSubscriber: Subscription;

    totalItems: any;

    theDate: NgbDateStruct;
    now = new Date();

    boardItems: MenuItem[];
    kanbanItems: MenuItem[];

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
        private stepcustomSce: StepCustomService,
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

        this.kanbanItems = [
            {
                label: 'Columns', icon: 'fa-columns', command: (onclick) => {
                    this.myColumns = true;
                    this.myStatuses = false;
                    this.mySprints = false;
                    this.searchRelatedColumns();
                }},
            {
                label: 'Statuses', icon: 'fa-eye', command: (onclick) => {
                    this.myColumns = false;
                    this.myStatuses = true;
                    this.mySprints = false;
                    this.searchRelatedSteps();
                }},
        ];

        this.boardItems = [
            {
                label: 'Sprints', icon: 'fa-undo', command: (onclick) => {
                    this.myColumns = false;
                    this.myStatuses = false;
                    this.mySprints = true;
                    this.searchRelatedSprints();
                }},
            {
                label: 'Columns', icon: 'fa-columns', command: (onclick) => {
                    this.myColumns = true;
                    this.myStatuses = false;
                    this.mySprints = false;
                    this.searchRelatedColumns();
                }},
            {
                label: 'Statuses', icon: 'fa-tachometer', command: (onclick) => {
                    this.myColumns = false;
                    this.myStatuses = true;
                    this.mySprints = false;
                    this.searchRelatedSteps();
                }},
        ];

        setTimeout(() => {
            if (this.boardcustom) {
                this.mySprints = true;
            }
            this.searchRelatedColumns();
            this.searchRelatedSprints();
            this.searchRelatedSteps();
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
        this.getAllSteps();
    }

    searchRelatedColumns() {
        this.columncustomSce.search({query : this.boardcustom.id})
            .subscribe(
                (res: ResponseWrapper) => this.retrieveColumns(res.json),
                (error) => console.log(error));
    }

    retrieveColumns(data) {
        this.relatedColumns = data;
        console.error('cols' +  this.relatedColumns.length)
    }

    searchRelatedSprints() {
        this.sprintcustomSce.search({query : this.boardcustom.id})
            .subscribe(
                (res: ResponseWrapper) => this.getRelatedSprints(res.json),
                (error) => console.log(error))
    }

    private getRelatedSprints(data) {
        this.relatedSprints = data;

        if (this.relatedSprints.length) {
            this.getActiveSprint();
        }
    }

    searchRelatedSteps() {
        this.stepcustomSce.search({query : this.boardcustom.project.process.id})
            .subscribe(
                (res: ResponseWrapper) => this.retrieveSteps(res.json),
                (error) => console.log(error));
    }

    retrieveSteps(data) {
        this.relatedSteps = data;
        console.error('stepss' +  this.relatedSteps.length)
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

    getAllSteps() {
        this.stepcustomSce.getStepCustoms()
            .then((stepCustoms) => this.stepCustoms = stepCustoms );
    }

    getStepsByWorkflow() {
        for (let st of this.stepCustoms) {
            if (this.boardcustom.project.process.id === st.workflow.id) {
                if (this.relatedStepsForBoard.indexOf(st) === -1) {
                    this.relatedStepsForBoard.push(st);
                }
            }
        }
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
