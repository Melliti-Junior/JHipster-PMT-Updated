import {Component, OnInit, OnDestroy, AfterViewInit, AfterContentInit, ViewChild, ElementRef} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { BoardCustom } from './board-custom.model';
import { BoardCustomService } from './board-custom.service';
import {IssueCustom, IssueCustomPopupService} from '../issue-custom';
import {IssueCustomService} from '../issue-custom/issue-custom.service';
import {SprintCustom, SprintCustomPopupService} from '../sprint-custom';
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
import {StepCustomService} from '../step-custom/step-custom.service';
import {TransitionCustomService} from '../transition-custom/transition-custom.service';
import {TransitionCustom} from '../transition-custom/transition-custom.model';
import {StepCustom} from '../step-custom/step-custom.model';

@Component({
    selector: 'jhi-board-custom-agile',
    templateUrl: './board-custom-agile.component.html',
    styleUrls: ['./board-custom-agile.component.css']
})
export class BoardCustomAgileComponent implements OnInit, OnDestroy, AfterContentInit {

    boardcustom: BoardCustom;
    activeSprint: SprintCustom;

    isSaving: boolean;

    issueCustoms: IssueCustom[] = new Array<IssueCustom>();
    relatedIssuesPerBoard: IssueCustom[] = new Array<IssueCustom>();
    relatedIssuesPerSprint: IssueCustom[] = new Array<IssueCustom>();
    relatedColumns: ColumnCustom[];
    relatedTransitions: TransitionCustom[];
    relatedSteps: StepCustom[];

    chosenIssues: IssueCustom[] = new Array<IssueCustom>();
    sprintCustoms: SprintCustom[];
    columnCustoms: ColumnCustom[];
    statuscustoms: StatusCustom[];

    relatedSprintsBoard: SprintCustom[];

    // Get the board related to the sprint
    parentBoard: BoardCustom;
    // Get the current board name
    boardname: string;

    numSprintsParentBoard = 0;

    private subscription: Subscription;
    private eventSubscriber: Subscription;

    totalItems: any;
    countRelatedSprints: number;

    theDate: NgbDateStruct;
    now = new Date();

    scrumItems: MenuItem[];
    kanbanItems: MenuItem[];

    Backlog = false;
    ActiveSprint = false;
    KanbanBoard = false;

    @ViewChild('divClick') divClick: ElementRef;

    constructor(
        private eventManager: JhiEventManager,
        private boardcustomSce: BoardCustomService,
        private route: ActivatedRoute,
        private issuecustomSce: IssueCustomService,
        private sprintcustomSce: SprintCustomService,
        private columncustomSce: ColumnCustomService,
        private statusService: StatusCustomService,
        private stepService: StepCustomService,
        private transitionService: TransitionCustomService,
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
        this.scrumItems = [
            {
                label: 'Backlog', icon: 'fa-tasks', command: (onclick) => {
                    this.Backlog = true; this.ActiveSprint = false;
                    this.getBacklogIssues(); this.getSprintIssues(); this.lookForRelatedTransitions(); this.lookForRelatedSteps();
                }},
            {
                label: 'ActiveSprint', icon: 'fa-columns', command: (onclick) => {
                    this.Backlog = false; this.ActiveSprint = true;
                    this.searchRelatedColumns(); this.lookForRelatedTransitions(); this.lookForRelatedSteps();
                }},
        ];
        this.kanbanItems = [
            {
                label: 'KanbanBoard', icon: 'fa-columns', command: (onclick) => {
                    this.KanbanBoard = true;
                    this.searchRelatedColumns(); this.lookForRelatedTransitions(); this.lookForRelatedSteps();
                }},
        ];

        setTimeout(() => {
            if (this.boardcustom) {
                if (this.boardcustom.type.toLowerCase() === 'scrum') {
                    this.Backlog = true;
                }
                if (this.boardcustom.type.toLowerCase() === 'kanban') {
                    this.KanbanBoard = true;
                }
            }
            if (this.columnCustoms) {
                this.searchRelatedColumns();
            }

            this.lookForRelatedTransitions();
            this.lookForRelatedSteps();
            this.getBacklogIssues();
            this.getSprintIssues();
            this.divClick.nativeElement.click();
        }, 100);

        setTimeout(() => {
            this.getBacklogIssues(); this.getSprintIssues(); this.searchRelatedColumns();
            this.divClick.nativeElement.click();
        }, 500);

    }

    getRelatedWorkflowSteps() {

    }

    getRelatedWorkflowTransitions() {

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
        this.getAllIssues()
        this.getAllSprints();
        this.getAllColumns();
        this.getAllStatuses();
    }

    makeNewIssueOpen(issuecustom: IssueCustom) {
        for (let status of this.statuscustoms) {
            if (status.name.toLowerCase() === 'open') {
                issuecustom.status = status;
            }
        }
    }

    searchOnlyRelatedSprints() {
        this.sprintcustomSce.search({query : this.boardcustom.id})
            .subscribe(
                (res: ResponseWrapper) => this.getRelatedSprints(res.json, res.headers),
                (error) => console.log(error))

        // Search the issues related to the active sprint
        this.getSprintIssues();

    }

    searchRelatedColumns() {
        this.getBacklogIssues();
        this.getSprintIssues();
        this.relatedColumns = new Array<ColumnCustom>();

        for (let col of this.columnCustoms) {
            if (col.board) {
                if (col.board.code.toLowerCase() === this.boardcustom.code.toLowerCase()) {
                    if (this.relatedColumns.indexOf(col) === -1) {
                        this.relatedColumns.push(col);
                    }
                }
            }
        }
        console.log(this.relatedColumns.length)
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
        this.statusService.getStatusCustoms()
            .then((statuscustoms) => this.statuscustoms = statuscustoms);
    }

    lookForRelatedTransitions() {
        this.transitionService.search({query : this.boardcustom.project.process.id})
            .subscribe(
                (res: ResponseWrapper) => this.retrieveTransitions(res.json),
                (error) => console.log(error));
    }

    retrieveTransitions(data) {
        this.relatedTransitions = data;
        console.error('trans' +  this.relatedTransitions.length)
    }

    lookForRelatedSteps() {
        this.stepService.search({query : this.boardcustom.project.process.id})
            .subscribe(
                (res: ResponseWrapper) => this.retrieveSteps(res.json),
                (error) => console.log(error));
    }

    retrieveSteps(data) {
        this.relatedSteps = data;
        console.error('steps' +  this.relatedSteps.length)
    }

    getStepByStatus(status: StatusCustom): StepCustom {
        let targetStep: StepCustom;
        let index = 0;
        let found = false;
        while (found === false && index <= this.relatedSteps.length) {
            if ((this.relatedSteps[index].status.id === status.id)) {
                found = true;
                targetStep = this.relatedSteps[index];
            }
        }
        return targetStep;
    }

    lookForActiveSprint() {
        let index = 0;
        let found = false;
        while (index < this.relatedSprintsBoard.length && found === false)  {
            if ((this.relatedSprintsBoard[index]).isActive) {
                found = true;
                this.activeSprint = this.relatedSprintsBoard[index];
            } else {
                index = index + 1;
            }
        }
        /*if (this.activeSprint !== undefined) {
            let x = <HTMLButtonElement> document.getElementById('createSprintBtn');
            x.disabled = true;
        }*/
    }

    getSprintIssues() {
        if (this.activeSprint !== undefined) {
            if (this.activeSprint.id !== undefined) {
                console.log('looking for ' + this.activeSprint.id)
                this.issuecustomSce.search({query : this.activeSprint.id})
                    .subscribe(
                        (res: ResponseWrapper) => this.retrieveIssuesOfSprint(res.json),
                        (error) => console.log(error));
                console.log('Actual iss per sp : ' + this.relatedIssuesPerSprint.length);
            }
        }
    }

    retrieveIssuesOfSprint(data) {
        this.relatedIssuesPerSprint = new Array<IssueCustom>();
        // this.chosenIssues = this.relatedIssuesPerSprint;
        for (let res of data) {
            let tempIssue: IssueCustom = res.valueOf();
            if (this.relatedIssuesPerSprint.indexOf(tempIssue) === -1) {
                console.log(tempIssue.code);
                this.relatedIssuesPerSprint.push(tempIssue);
            }
            // console.log(this.activesprint.id)
        }
        console.log(this.relatedIssuesPerSprint.length)
    }
    getBacklogIssues() {
        // let index = 0;
        this.relatedIssuesPerBoard = new Array<IssueCustom>();
        this.loadAttributes();
        // let found = false;
        for (let issue of this.issueCustoms) {
            if ((issue.project.name === this.boardcustom.project.name) && (issue.sprint === null)) {
                this.relatedIssuesPerBoard.push(issue);
            }
        }

        //  Search the related sprints to identify the active one
        this.searchOnlyRelatedSprints();

        console.log('Actual : ' + this.relatedIssuesPerBoard.length);
    }

    searchActiveSprint() {
        if (this.activeSprint.id === undefined) {
            this.sprintcustomSce.search({query : this.activeSprint.code}, )
                .subscribe(
                    (res: ResponseWrapper) => this.getCurrentSprintObj(res.json),
                    (error) => console.log(error));
        }
    }

    startSprint() {

        let startSpBtn = <HTMLButtonElement> document.getElementById('startSprintBtn');

        if (this.activeSprint.isActive) {
            startSpBtn.hidden = true;
        }

        // Look for the active sprint in this board
        // this.searchActiveSprint();

        // this.affectIssuesToSprint();

    }

    prepareSprint() {
        if (this.activeSprint === undefined) {
            // count total sprints created in this board
            console.log('count related Sprints ' + this.relatedSprintsBoard.length )
            this.numSprintsParentBoard = this.countRelatedSprints + 1;

            // prepare the new sprint
            this.activeSprint = new SprintCustom();
            this.activeSprint.code = this.boardcustom.code + '_' + 'Sprint' + '_' + this.numSprintsParentBoard;
            this.activeSprint.name = this.boardcustom.code + '_' + 'Sprint' + '_' + this.numSprintsParentBoard;
            this.activeSprint.board = this.boardcustom;

            this.isSaving = true;
            if (this.activeSprint.id === undefined) {
                this.subscribeToSaveResponse(
                    this.sprintcustomSce.create(this.activeSprint));
            }

            setTimeout(() => {
                this.searchActiveSprint();
            }, 500);

            let x = <HTMLButtonElement> document.getElementById('createSprintBtn');
            x.disabled = true;
        } else {
            let x = <HTMLButtonElement> document.getElementById('createSprintBtn');
            x.disabled = true;

        }

    }

    private subscribeToSaveResponse(result: Observable<BoardCustom>) {
        result.subscribe((res: BoardCustom) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private subscribeToSaveResponseIssues(result: Observable<IssueCustom>) {
        result.subscribe((res: IssueCustom) =>
            this.onSaveSuccessIssues(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: BoardCustom) {
        this.eventManager.broadcast({ name: 'sprintcustomsListModification', content: 'OK'});
        this.isSaving = false;
    }

    private onSaveSuccessIssues(result: IssueCustom) {
        this.eventManager.broadcast({ name: 'issuecustomsListModification', content: 'OK'});
        this.isSaving = false;
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private getCurrentSprintObj(data) {
        for (let res of data) {
            this.activeSprint = res.valueOf();
            console.error('sprinnnttt ' + JSON.stringify(this.activeSprint))

        }
    }

    private getRelatedSprints(data, headers) {
        this.totalItems = headers.get('X-Total-Count');
        this.countRelatedSprints = parseInt(this.totalItems, 10);

        console.log('count ' + this.countRelatedSprints)
        this.relatedSprintsBoard = data.valueOf();

        // console.log(this.relatedSprintsBoard);

        this.lookForActiveSprint();
    }

    dragStart(ev) {
        console.error('drag event starts here');

        ev.dataTransfer.setData('text', ev.target.id);
        console.log(ev.target.id);

        for (let issue of this.issueCustoms) {
            if (issue.id === ev.target.id) {

                this.issuecustomSce.find(issue.id).subscribe((issuecustom) => {
                    if (issue.createdDate) {
                        issue.createdDate = {
                            year: issuecustom.createdDate.getFullYear(),
                            month: issuecustom.createdDate.getMonth() + 1,
                            day: issuecustom.createdDate.getDate()
                        };
                    }
                    if (issue.updatedDate) {
                        issue.updatedDate = {
                            year: issuecustom.updatedDate.getFullYear(),
                            month: issuecustom.updatedDate.getMonth() + 1,
                            day: issuecustom.updatedDate.getDate()
                        };
                    }
                    if (issue.dueDate) {
                        issue.dueDate = {
                            year: issuecustom.dueDate.getFullYear(),
                            month: issuecustom.dueDate.getMonth() + 1,
                            day: issuecustom.dueDate.getDate()
                        };
                    }
                });

                console.log(issue.code);
                console.error('drag event stops here');
            }
        }

    }

    allowDrop($event) {
        // alert($event.target.id)
        if ((!this.activeSprint.isActive) && ($event.target.id.includes('droppable') === true)) {
            $event.preventDefault();
        }
    }

    dragend(ev) {
        console.error('dragend starts here');

        let data = ev.dataTransfer.getData('text');

        // this.searchActiveSprint();

        // this.affectIssuesToSprint();

        this.getBacklogIssues();

        this.getSprintIssues();

        console.error('dragend stops here');

    }

    drop(ev) {
        console.error('dropev starts here')
        ev.preventDefault();
        // tslint:disable-next-line:prefer-const
        let data = ev.dataTransfer.getData('text');
        ev.target.appendChild(document.getElementById(data));
        // console.log(document.getElementById(data).id);

        if (!this.activeSprint.id) {
            this.searchActiveSprint();
        }
        ///////
        for (let issue of this.issueCustoms) {
            if (issue.id === document.getElementById(data).id) {
                this.isSaving = true;
                this.makeNewIssueOpen(issue);
                issue.sprint = Object.assign({}, this.activeSprint);
                // issue.updatedDate = this.theDate;
                this.subscribeToSaveResponseIssues(
                    this.issuecustomSce.update(issue));
                if (issue.id !== undefined) {
                    console.log('update ' + issue.code + ' with sprint ' + issue.sprint.name);
                }
            }
            // this.affectIssuesToSprint();
            console.error('dropev stops here');
        }
        if (!this.activeSprint.isActive) {
            let x = <HTMLButtonElement> document.getElementById('startSprintBtn');
            x.disabled = false;
        }
    }

    dragStartColBoard(ev) {
        ev.dataTransfer.setData('text', ev.target.id);
    }

    dragendColBoard(ev) {
        console.error('dragend starts here');

        let data = ev.dataTransfer.getData('text');

        // this.searchActiveSprint();

        // this.affectIssuesToSprint();

        let parent = ev.target.parentElement;

        console.log(parent.childElementCount + 'counnntt')
        for (let i = 0; i < parent.children.length; i++) {
            parent.children[i].hidden = false;
        }

        console.log('cls ' + parent.className);
        console.log('cls parent ' + parent.parentElement.id);

        if (this.boardcustom && this.boardcustom.type.toLowerCase() === 'kanban') {
            let workingCol: ColumnCustom;
            if (parent.parentElement.className === 'agileColumn') {
                let found = false;
                let index = 0;
                while (found === false && index <= this.columnCustoms.length) {
                    if (this.columnCustoms[index].id === parent.parentElement.id) {
                        found = true;
                        workingCol = this.columnCustoms[index];
                        console.log('col' + workingCol.name);
                    } else {
                        index = index + 1;
                    }
                }
            }

            let countIssues = 0;
            for (let iss of this.relatedIssuesPerBoard) {
                if (iss.status) {

                    let step = this.getStepByStatus(iss.status);
                    // console.log(iss.status.column.name);
                    console.log(step.column.name);
                    console.log(parent.parentElement.name);
                    // if (iss.status && iss.status.column.id === parent.parentElement.id) {
                    if (step && step.column.id === parent.parentElement.id) {
                        countIssues = countIssues + 1;
                        console.log('hereeeeee' + countIssues);
                    }
                }
            }

            if (workingCol.min && countIssues < workingCol.min) {
                console.log('Capacity shortfall by ' + (workingCol.min - countIssues) + ' cards')
                parent.style.backgroundColor = 'green'
            } else {
                if (workingCol.max && countIssues > workingCol.max) {
                    console.log('Capacity exceeded by ' + (countIssues - workingCol.max) + ' cards')
                    parent.style.backgroundColor = 'red'
                } else {
                    parent.style.backgroundColor = '#f5f5f5'
                }
            }
        }

        for (let child of parent.children) {
            if (!child.hidden) {
                // console.log('children ' + (parent.children.length - this.issueCustoms.length));
                console.log('children ' + (parent.children.length - this.issueCustoms.length));
            }
        }

        parent.style.border = '1px solid #888888';
        console.error('dragend stops here');
    }

    dragleaveColBoard(ev) {
        console.error('dragleave starts here');
        // let parent = ev.target.parentElement;
        if (ev.target.children !== undefined) {
            console.log('curr' + ev.target.className);
            for (let i = 0; i < ev.target.children.length; i++) {
                console.log(ev.target.children.length);
                if (ev.target.children[i].hidden) {
                    ev.target.children[i].hidden = false;
                    ev.target.style.border = '1px solid #888888';
                }
            }
        }
    }

    allowDropColBoard($event) {

        let elt = $event.target;
        while ((elt.id === undefined) || (elt.id.includes('droppable') === false)) {
            // console.log('me ' + elt.className);
            elt = elt.parentElement;
            // console.log('my parent ' + elt.className);
        }
        if (elt.id.includes('droppable') === true) {
            $event.preventDefault();
            elt.style.border = '2px dashed blueviolet';
            // console.log('count ' + elt.children.length)

            for (let i = 0; i < elt.children.length; i++) {
                elt.children[i].hidden = true;
            }
        }
    }

    dropColBoard(ev) {
        console.error('dropev starts here')
        ev.preventDefault();
        // tslint:disable-next-line:prefer-const
        let data = ev.dataTransfer.getData('text');
        ev.target.appendChild(document.getElementById(data));

        console.log('just drop ' + document.getElementById(data).id)
    }

}
