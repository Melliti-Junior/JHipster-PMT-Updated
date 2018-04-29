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

    chosenIssues: IssueCustom[] = new Array<IssueCustom>();
    sprintCustoms: SprintCustom[];
    columnCustoms: ColumnCustom[];

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
                    this.getBacklogIssues(); this.getSprintIssues();
                }},
            {
                label: 'ActiveSprint', icon: 'fa-table', command: (onclick) => {
                    this.Backlog = false; this.ActiveSprint = true;
                    this.searchRelatedColumns()
                }},
        ];
        this.kanbanItems = [
            {
                label: 'KanbanBoard', icon: 'fa-bar-table', command: (onclick) => {
                    this.KanbanBoard = true;
                    this.searchRelatedColumns()
                }},
        ];

        setTimeout(() => {
            if (this.boardcustom.type.toLowerCase() === 'scrum') {
                this.Backlog = true;
            }
            if (this.boardcustom.type.toLowerCase() === 'kanban') {
                this.KanbanBoard = true;
            }
            this.getBacklogIssues(); this.getSprintIssues(); this.searchRelatedColumns();
            this.divClick.nativeElement.click();
        }, 100);

        setTimeout(() => {
            this.getBacklogIssues(); this.getSprintIssues(); this.searchRelatedColumns();
            this.divClick.nativeElement.click();
        }, 500);
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
        this.issuecustomSce.getIssueCustoms()
            .then((issueCustoms) => this.issueCustoms = issueCustoms );
        // this.getBacklogIssues();
        console.log('Total : ' + this.issueCustoms.length);
        this.getAllSprints();
        // this.getSprintIssues();
        this.getAllColumns();
    }

    searchOnlyRelatedSprints() {
        this.sprintcustomSce.search({query : this.boardcustom.name})
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
            if (col.board.code.toLowerCase() === this.boardcustom.code.toLowerCase()) {
                if (this.relatedColumns.indexOf(col) === -1) {
                    this.relatedColumns.push(col);
                }
            }
        }
        console.log(this.relatedColumns.length)
    }

    getAllSprints() {
        this.sprintcustomSce.getSprintCustoms()
            .then((sprintCustoms) => this.sprintCustoms = sprintCustoms );
    }

    getAllColumns() {
        this.columncustomSce.getColumnCustoms()
            .then((columnCustoms) => this.columnCustoms = columnCustoms );
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

        let x = <HTMLButtonElement> document.getElementById('startSprintBtn');
        x.disabled = true;
        // Look for the active sprint in this board
        // this.searchActiveSprint();

        // this.affectIssuesToSprint();

    }

    affectIssuesToSprint() {
        // Affect chosen issues to the active sprint
        for (let issue of this.chosenIssues) {
            if (issue.id !== undefined) {
                this.isSaving = true;
                issue.sprint = Object.assign({}, this.activeSprint);
                // issue.updatedDate = this.theDate;
                this.subscribeToSaveResponseIssues(
                    this.issuecustomSce.update(issue));
/*
                this.issuecustomSce.search({query : issue.code})
                    .subscribe(
                        (res: ResponseWrapper) => console.log(),
                        (error) => console.log(error));
*/
                console.log('update ' + issue.code + ' with sprint ' + issue.sprint.name);
            }
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
            console.log(this.activeSprint.id)
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
        if ((!this.activeSprint.isActive) && ($event.target.id.localeCompare('droppable') !== -1)) {
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

        for (let issue of this.issueCustoms) {
            if (issue.id === document.getElementById(data).id) {

                /*
                let index = this.relatedIssuesPerSprint.indexOf(issue);
                console.log('before splice ' + this.relatedIssuesPerSprint.length)
                if(index !== -1) {
                    this.relatedIssuesPerBoard.splice(index, 1);
                }
                console.log('after splice ' + this.relatedIssuesPerSprint.length)
*/
                if (this.chosenIssues.indexOf(issue) === -1) {
                    this.chosenIssues.push(issue);
                }

                console.log(issue.code);
                console.log('chosen : ' + this.chosenIssues.length);
                // Affect active sprint to current issue
                // issue.sprint = Object.assign({}, this.activesprint);
                // console.log('sprint ' + issue.sprint.name + ' of ' + issue.code);
            }

            this.searchActiveSprint();
            this.affectIssuesToSprint();
            console.error('dropev stops here');
        }

        if (!this.activeSprint.isActive) {
            let x = <HTMLButtonElement> document.getElementById('startSprintBtn');
            x.disabled = false;
        }

        /*
        // Return the elt by ID and use it to add it to the selected Issues
        let x = this.issuecustomSce.find(document.getElementById(data).id);

        console.log('before ' + this.chosenIssues.length);

        // let issue: IssueCustom;
        // this.chosenIssues.push(issue);

        this.issuecustomSce.find(document.getElementById(data).id)
            .subscribe((res) => this.chosenIssues.push(res));

        console.log('after ' + this.chosenIssues.length);

        for (let index = 0; index < this.chosenIssues.length; index++) {
            console.log(this.chosenIssues[index].code);
        }
        */
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

        for (let i = 0; i < parent.children.length; i++) {
            parent.children[i].hidden = false;
        }
        console.log('cls' + parent.className);

        parent.style.border = '0px';

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
                    ev.target.style.border = '0px';
                }
            }
        }
    }

    allowDropColBoard($event) {

        let elt = $event.target;
        while ((elt.id === undefined) || (elt.id.localeCompare('columndroppable') === -1)) {
            console.log('me ' + elt.className);
            elt = elt.parentElement;
            console.log('my parent ' + elt.className);
        }
        if (elt.id.localeCompare('columndroppable') !== -1) {
            $event.preventDefault();
            elt.style.border = '2px dashed blueviolet';
            console.log('count ' + elt.children.length)

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
    }

}
