import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {JhiEventManager} from 'ng-jhipster';

import {BoardCustom} from './board-custom.model';
import {BoardCustomService} from './board-custom.service';
import {IssueCustom} from '../issue-custom';
import {IssueCustomService} from '../issue-custom/issue-custom.service';
import {SprintCustom} from '../sprint-custom';
import {SprintCustomService} from '../sprint-custom/sprint-custom.service';
import {Observable} from 'rxjs/Observable';
import {Response} from '@angular/http';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
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
export class BoardCustomAgileComponent implements OnInit, OnDestroy {

    boardcustom: BoardCustom;
    activeSprint: SprintCustom;

    isSaving: boolean;

    issueCustoms: IssueCustom[] = new Array<IssueCustom>();
    relatedIssuesPerBoard: IssueCustom[] = new Array<IssueCustom>();
    relatedIssuesPerSprint: IssueCustom[] = new Array<IssueCustom>();
    relatedColumns: ColumnCustom[];
    relatedTransitions: TransitionCustom[];
    relatedSteps: StepCustom[];
    nextPossibleSteps: StepCustom[];

    sprintCustoms: SprintCustom[];
    columnCustoms: ColumnCustom[];
    statuscustoms: StatusCustom[];
    transitioncustoms: TransitionCustom[];
    stepcustoms: StepCustom[];

    relatedSprintsBoard: SprintCustom[];

    progress: number;

    numSprintsParentBoard = 0;

    private subscription: Subscription;
    private eventSubscriber: Subscription;

    totalItems: any;
    countRelatedSprints: number;

    theDate: NgbDateStruct;
    now = new Date();

    scrumItems: MenuItem[];
    scrumViewItems: MenuItem[];
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
        private router: Router
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInBoardCustoms();
        this.loadAttributes();
        this.theDate = {year: this.now.getFullYear(), month: this.now.getMonth() + 1, day: this.now.getDate()};

        setTimeout(() => {
            this.scrumItems = [
                {
                    label: 'Backlog', icon: 'fa-tasks', command: (onclick) => {
                        this.Backlog = true; this.ActiveSprint = false;
                        this.getBacklogIssues(); this.getSprintIssues(); this.lookForRelatedTransitions(); this.lookForRelatedSteps();
                    }},
                {
                    label: 'ActiveSprint', icon: 'fa-columns', command: (onclick) => {
                        this.Backlog = false; this.ActiveSprint = true;
                        this.LookForRelatedColumns(); this.lookForRelatedTransitions(); this.lookForRelatedSteps();
                    }},
            ];

            this.scrumViewItems = [
                {
                    label: 'ActiveSprint', icon: 'fa-columns', command: (onclick) => {
                        this.Backlog = false; this.ActiveSprint = true;
                        this.LookForRelatedColumns(); this.lookForRelatedTransitions(); this.lookForRelatedSteps();
                    }},
            ];

            this.kanbanItems = [
                {
                    label: 'KanbanBoard', icon: 'fa-columns', command: (onclick) => {
                        this.KanbanBoard = true;
                        this.LookForRelatedColumns(); this.lookForRelatedTransitions(); this.lookForRelatedSteps();
                    }},
            ];

            if (this.boardcustom) {
                if (this.boardcustom.type.toLowerCase() === 'scrum' && this.scrumItems) {
                    this.Backlog = true; this.ActiveSprint = false;
                }
                if (this.boardcustom.type.toLowerCase() === 'scrum' && this.scrumViewItems) {
                    this.ActiveSprint = true; this.Backlog = false;
                }
                if (this.boardcustom.type.toLowerCase() === 'kanban') {
                    this.KanbanBoard = true;
                }
            }
            if (this.columnCustoms) {
                this.LookForRelatedColumns();
            }

            if (this.transitioncustoms) {
                this.lookForRelatedTransitions();
            }

            if (this.stepcustoms) {
                this.lookForRelatedSteps();
            }

            this.getBacklogIssues();
            this.getSprintIssues();
            this.divClick.nativeElement.click();
        }, 100);

        setTimeout(() => {
            this.getBacklogIssues();
            this.getSprintIssues();
            this.LookForRelatedColumns();
            this.lookForRelatedTransitions();
            this.lookForRelatedSteps();
            this.divClick.nativeElement.click();
        }, 500);

    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
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

    getAllTransitions() {
        this.transitionService.getTransitionCustoms()
            .then((transitioncustoms) => this.transitioncustoms = transitioncustoms);
    }

    getAllSteps() {
        this.stepService.getStepCustoms()
            .then((stepcustoms) => this.stepcustoms = stepcustoms);
    }

    load(id) {
        this.boardcustomSce.find(id).subscribe((boardcustom) => {
            this.boardcustom = boardcustom;
        });
    }
    previousState() {
        window.history.back();
    }

    transition() {
        this.getAllSprints();
        this.getBacklogIssues();
        this.getSprintIssues();
        this.LookForRelatedColumns();
        this.lookForRelatedTransitions();
        this.lookForRelatedSteps();
        this.activeSprint.isActive = false;
        /*
        for (let sp of this.sprintCustoms) {
            if (sp.id === this.activeSprint.id) {
                this.activeSprint = sp;
            }
        }
        */
        this.router.navigate(['/boardcustoms/agile', this.boardcustom.id]);
    }

    registerChangeInBoardCustoms() {
        this.eventSubscriber = this.eventManager.subscribe(
            'boardcustomsAgileModification',
            // (response) => this.load(this.boardcustom.id)
            (response) => this.transition()
        );
    }

    private loadAttributes() {
        this.getAllIssues()
        this.getAllSprints();
        this.getAllColumns();
        this.getAllStatuses();
        this.getAllSteps();
        this.getAllTransitions()
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

    LookForRelatedColumns() {
        this.getBacklogIssues();
        this.getSprintIssues();
        this.relatedColumns = new Array<ColumnCustom>();

        for (let col of this.columnCustoms) {
            if (col.board) {
                if (col.board.code.toLowerCase() === this.boardcustom.code.toLowerCase()) {
                    if (this.relatedColumns.indexOf(col) === -1) {
                        // this.relatedColumns.push(col);
                        this.relatedColumns.splice(col.order - 1, 0, col);
                        this.relatedColumns.sort();
                    }
                }
            }
        }
        console.log(this.relatedColumns.length)
    }

    lookForRelatedTransitions() {
        this.relatedTransitions = new Array<TransitionCustom>();
        for (let trans of this.transitioncustoms) {
            if (trans.workflow.id === this.boardcustom.project.process.id) {
                if (this.relatedTransitions.indexOf(trans) === -1) {
                    this.relatedTransitions.push(trans);
                }
            }
        }
    }

    lookForRelatedSteps() {
        this.relatedSteps = new Array<StepCustom>();
        for (let step of this.stepcustoms) {
            console.log('step wf ' + step.workflow.id + 'process ' + this.boardcustom.project.process.id)
            if (step.workflow.id === this.boardcustom.project.process.id) {
                if (this.relatedSteps.indexOf(step) === -1) {
                    this.relatedSteps.push(step);
                }
            }
        }
    }

    getStepByStatus(status: StatusCustom): StepCustom {
        let targetStep: StepCustom;
        let index = 0;
        let found = false;
        while (found === false && index <= this.relatedSteps.length) {
            if ((this.relatedSteps[index].status.id === status.id)) {
                found = true;
                targetStep = this.relatedSteps[index];
                // console.log('target ' + JSON.stringify(targetStep))
            } else {
                index = index + 1;
            }
        }
        return targetStep;
    }

    getNextPossibleSteps(sourceStep: StepCustom): StepCustom[] {
        let tempSteps = new Array<StepCustom>();
        for (let tran of this.relatedTransitions) {
            if (tran.sourceStep.id === sourceStep.id) {
                let target = tran.targetStep;
                if (tempSteps.indexOf(target) === -1) {
                    tempSteps.push(target);
                }
            }
        }

        return tempSteps;
    }

    getOpenStep(): StepCustom {
        let tempStep = new StepCustom();
        for (let step of this.relatedSteps) {
            if (step.status.category.code.toUpperCase() === 'NEW') {
                tempStep = step;
            }
        }
        return tempStep;
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
    }

    getSprintIssues() {
        if (this.activeSprint !== undefined) {
            if (this.activeSprint.id !== undefined) {
                console.log('looking for ' + this.activeSprint.id);

                this.relatedIssuesPerSprint = new Array<IssueCustom>();
                for (let issue of this.issueCustoms) {
                    if (this.activeSprint && issue.sprint && issue.sprint.id === this.activeSprint.id) {
                        if (this.relatedIssuesPerSprint.indexOf(issue) === -1) {
                            console.log(issue.code);
                            this.relatedIssuesPerSprint.push(issue);
                        }
                    }
                }
                console.log('Actual iss per sp length : ' + this.relatedIssuesPerSprint.length);
                console.log('Actual iss per sp : ' + JSON.stringify(this.relatedIssuesPerSprint));
            }
        }
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

        this.searchOnlyRelatedSprints();

        console.log('Actual : ' + this.relatedIssuesPerBoard.length);
    }

    searchActiveSprint() {
        if (this.activeSprint.id === undefined) {
            this.sprintcustomSce.search({query : this.activeSprint.code}, )
                .subscribe(
                    (res: ResponseWrapper) => this.getCurrentSprint(res.json),
                    (error) => console.log(error));
        }
    }

    startSprint() {

        let startSpBtn = <HTMLButtonElement> document.getElementById('startSprintBtn');

        if (this.activeSprint.isActive) {
            startSpBtn.hidden = true;
        }
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

    private getCurrentSprint(data) {
        if (data) {
            for (let res of data) {
                this.activeSprint = res.valueOf();
            }
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
        ev.dataTransfer.setData('text', ev.target.id);
        console.log(ev.target.id);

        for (let issue of this.issueCustoms) {
            if (issue.id === ev.target.id) {

                this.validateIssue(issue);
            }
        }

    }

    allowDrop($event) {
        if ((!this.activeSprint.isActive) && ($event.target.id.includes('droppable') === true)) {
            $event.preventDefault();
        }
    }

    dragend(ev) {

        let data = ev.dataTransfer.getData('text');

        this.getBacklogIssues();

        this.getSprintIssues();

    }

    drop(ev) {
        ev.preventDefault();
        let data = ev.dataTransfer.getData('text');
        ev.target.appendChild(document.getElementById(data));

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
        }
        if (!this.activeSprint.isActive) {
            let x = <HTMLButtonElement> document.getElementById('startSprintBtn');
            x.disabled = false;
        }
    }

    private validateIssue(issue) {
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

    }

    dragStartColBoard(ev) {
        ev.dataTransfer.setData('text', ev.target.id);

        console.error('start ' + ev.target.id);

        for (let issue of this.issueCustoms) {
            if (issue.id === ev.target.id) {

                this.validateIssue(issue);

                if (issue.status) {
                    console.log('old ' + issue.status.name);

                    console.log('new' + issue.status.name);

                    let step = this.getStepByStatus(issue.status);

                    this.nextPossibleSteps = this.getNextPossibleSteps(step);

                } else {
                    // if the issue is still unresolved
                    let openStep: StepCustom = this.getOpenStep();
                    this.nextPossibleSteps = new Array<StepCustom>();
                    this.nextPossibleSteps.push(openStep);
                }
            }
        }

        for (let issue of this.issueCustoms) {
            if (issue.id === ev.target.id) {
                console.log(issue.code);
            }
        }

    }

    dragendColBoard(ev) {

        let data = ev.dataTransfer.getData('text');

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
/*
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
                    }
                }
            }

            if (workingCol.min && countIssues < workingCol.min) {
                console.log('Capacity shortfall by ' + (workingCol.min - countIssues) + ' cards')
                parent.style.backgroundColor = 'yellow'
            } else {
                if (workingCol.max && countIssues > workingCol.max) {
                    console.log('Capacity exceeded by ' + (countIssues - workingCol.max) + ' cards')
                    parent.style.backgroundColor = 'red'
                } else {
                    parent.style.backgroundColor = '#f5f5f5'
                }
            }
*/
        }
        parent.style.border = '1px solid #888888';
    }

    dragleaveColBoard(ev) {
        if (ev.target.children !== undefined) {
            console.log('curr' + ev.target.className);
            for (let i = 0; i < ev.target.children.length; i++) {
                console.log(ev.target.children.length);
                if (ev.target.children[i].hidden) {
                    ev.target.children[i].hidden = false;
                    ev.target.style.border = '1px solid #888888';
                    ev.target.style.backgroundColor = '#f5f5f5';
                }
            }
        }
    }

    isAllowedToReceiveIn(col: ColumnCustom): boolean {
        console.log('col id ' + col.id)
        let allowed = false;
        let stop = false;
        let index = 0;
        if (this.nextPossibleSteps && this.nextPossibleSteps.length > 0) {
            while (stop === false && allowed === false && index <= this.nextPossibleSteps.length) {

                if (this.nextPossibleSteps[index] && this.nextPossibleSteps[index].column) {
                    if (this.nextPossibleSteps[index].column.id === col.id) {
                        allowed = true;
                        console.log('allowed')
                    } else {
                        index = index + 1;
                    }
                } else {
                    stop = true;
                }
            }
        }

        return allowed;
    }

    getCurrentColumnByID(ID: string): ColumnCustom {
        let found = false;
        let index = 0;
        let currCol = new ColumnCustom();
        while (found === false && index <= this.relatedColumns.length) {
            if (this.relatedColumns[index].id === ID) {
                found = true;
                currCol = this.relatedColumns[index];
            } else {
                index = index + 1;
            }
        }
        return currCol;
    }

    allowDropColBoard($event) {

        let currColDivElt = $event.target.parentElement;

        console.log('col');
        let currCol = this.getCurrentColumnByID(currColDivElt.id);

        let isAllowed = this.isAllowedToReceiveIn(currCol);
        console.log(this.isAllowedToReceiveIn(currCol));

        if (isAllowed) {
            for (let autStat of this.nextPossibleSteps) {
                if (autStat.column.id === currColDivElt.id) {
                    console.log('yepppp')

                    let index = 0;
                    let found = false;
                    while (index <= this.relatedColumns.length && found === false) {
                        if (this.relatedColumns[index].id === autStat.column.id) {
                            found = true;
                        } else {
                            index = index + 1;
                        }
                    }
                    console.log(index + ' index')

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
            }
        } else {
            let elt = $event.target;
            while ((elt.id === undefined) || (elt.id.includes('droppable') === false)) {
                // console.log('me ' + elt.className);
                elt = elt.parentElement;
                // console.log('my parent ' + elt.className);
            }
            if (elt.id.includes('droppable') === true) {
                // elt.style.border = '2px solid red';
                elt.style.backgroundColor = 'Grey';
                // console.log('count ' + elt.children.length)

                for (let i = 0; i < elt.children.length; i++) {
                    elt.children[i].hidden = true;
                }
            }

        }
    }

    dropColBoard(ev) {
        ev.preventDefault();
        // tslint:disable-next-line:prefer-const
        let data = ev.dataTransfer.getData('text');

        console.error(data);

        ev.target.appendChild(document.getElementById(data));

        let currColDivElt = ev.target.parentElement;

        console.log('col');
        let currCol = this.getCurrentColumnByID(currColDivElt.id);

        console.error(currCol.id)

        let currentStep: StepCustom;
        for (let step of this.nextPossibleSteps) {
            if (step.column.id === ev.target.parentElement.id) {
                currentStep = step;
            }
        }

        for (let issue of this.issueCustoms) {
            if (issue.id === document.getElementById(data).id) {
                this.isSaving = true;

                if (currentStep.status.category.name.toLowerCase() === 'done') {
                    this.router.navigate(['/', { outlets: { popup : 'issuecustoms/' + issue.id + '/resolve' } }]);
                    document.getElementById(data).style.textDecoration = 'line-through';
                } else {
                    if (currentStep.status.category.name.toLowerCase() !== 'done') {
                        issue.resolution = null;
                        document.getElementById(data).style.textDecoration = 'none';
                    }
                }

                issue.progress = Math.round((this.relatedColumns.indexOf(currCol) + 1) / this.relatedColumns.length * 100)
                this.progress = issue.progress;

                let progresId = issue.code;
                let issueProgress = <HTMLProgressElement> document.getElementById(progresId);

                issueProgress.style.width = issue.progress + '%';
                issueProgress.innerText = issue.progress + '%';

                issue.status = Object.assign({}, currentStep.status);

                this.subscribeToSaveResponseIssues(
                    this.issuecustomSce.update(issue));
                if (issue.id !== undefined) {
                    console.log('update ' + issue.code + ' with status ' + issue.status.name);
                }

            }
        }

        let count = 0;
        for (let issue of this.issueCustoms) {
            for (let step of this.relatedSteps) {
                if (issue.status.id === step.status.id && step.column.id === currCol.id) {
                    count = count + 1;
                }
            }
        }
        console.error(count + " count issues per col");

        if (currCol.min && count < currCol.min) {
            console.log('Capacity shortfall by ' + (currCol.min - count) + ' cards')
            ev.target.style.backgroundColor = 'yellow'
        } else {
            if (currCol.max && count > currCol.max) {
                console.log('Capacity exceeded by ' + (count - currCol.max) + ' cards')
                ev.target.style.backgroundColor = 'red'
            } else {
                ev.target.style.backgroundColor = '#f5f5f5'
            }
        }
    }

    verifyColumnCapacity(ev) {

        let currColDivElt = ev.target.parentElement;
        let currCol = this.getCurrentColumnByID(currColDivElt.id)

        console.log(currColDivElt);
        console.log(currCol.id);

        let count = 0;
        for (let issue of this.issueCustoms) {
            for (let step of this.relatedSteps) {
                if (issue.status.id === step.status.id && step.column.id === currCol.id) {
                    count = count + 1;
                    console.error(issue.summary)
                }
            }
        }
        console.error(count + " count issues per col");

        if (currCol.min && count < currCol.min) {
            console.log('Capacity shortfall by ' + (currCol.min - count) + ' cards')
            ev.target.style.backgroundColor = 'yellow'
        } else {
            if (currCol.max && count > currCol.max) {
                console.log('Capacity exceeded by ' + (count - currCol.max) + ' cards')
                ev.target.style.backgroundColor = 'red'
            } else {
                ev.target.style.backgroundColor = '#f5f5f5'
            }
        }
    }

    private onSaveError() {
        this.isSaving = false;
    }
}
