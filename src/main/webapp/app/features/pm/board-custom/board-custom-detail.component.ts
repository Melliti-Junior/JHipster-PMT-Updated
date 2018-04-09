import {Component, OnInit, OnDestroy, AfterViewInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { BoardCustom } from './board-custom.model';
import { BoardCustomService } from './board-custom.service';
import {IssueCustom} from '../issue-custom';
import {IssueCustomService} from '../issue-custom/issue-custom.service';
import {SprintCustom, SprintCustomService} from '../sprint-custom';
import {Observable} from 'rxjs/Observable';
import {Response} from '@angular/http';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ResponseWrapper} from '../../../shared';

@Component({
    selector: 'jhi-board-custom-detail',
    templateUrl: './board-custom-detail.component.html',
    styleUrls: ['./board-custom-detail.component.css']
})
export class BoardCustomDetailComponent implements OnInit, OnDestroy, AfterViewInit {

    boardcustom: BoardCustom;
    activesprint: SprintCustom;

    isSaving: boolean;

    issueCustoms: IssueCustom[] = new Array<IssueCustom>();
    relatedissuecustoms: IssueCustom[] = new Array<IssueCustom>();

    chosenIssues: IssueCustom[] = new Array<IssueCustom>();
    sprintCustoms: SprintCustom[];

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

    constructor(
        private eventManager: JhiEventManager,
        private boardcustomSce: BoardCustomService,
        private route: ActivatedRoute,
        private issuecustomSce: IssueCustomService,
        private sprintcustomSce: SprintCustomService,
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInBoardCustoms();
        this.loadAttributes();
        // this.getProjectIssues();
    }

    ngAfterViewInit() {
        console.log('finish');
        // this.getProjectIssues();
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
        // this.getProjectIssues();
        console.log('Total : ' + this.issueCustoms.length);
        this.getAllSprints();
    }

    returnOnlyRelatedSprints() {
        this.sprintcustomSce.search({query : this.boardcustom.name})
            .subscribe(
                (res: ResponseWrapper) => this.getRelatedSprints(res.json, res.headers),
                (error) => console.log(error))
    }

    getAllSprints() {
        this.sprintcustomSce.getSprintCustoms()
            .then((sprintCustoms) => this.sprintCustoms = sprintCustoms );
    }

    lookForActiveSprint() {
        let index = 0;
        let found = false;
        while (index < this.relatedSprintsBoard.length && found === false)  {
            if ((this.relatedSprintsBoard[index]).isActive) {
                found = true;
                this.activesprint = this.relatedSprintsBoard[index];
            } else {
                index = index + 1;
            }
        }
        if (this.activesprint !== undefined) {
            let x = <HTMLButtonElement> document.getElementById('createSprintBtn');
            x.disabled = true;
        }
    }

    getProjectIssues() {
        // let index = 0;
        this.relatedissuecustoms = new Array<IssueCustom>();
        this.loadAttributes();
        // let found = false;
        for (let issue of this.issueCustoms) {
            if (issue.project.name === this.boardcustom.project.name) {
                this.relatedissuecustoms.push(issue);
            }
        }

        this.returnOnlyRelatedSprints();

        console.log('Actual : ' + this.relatedissuecustoms.length);
    }

    startSprint(sprint: SprintCustom) {
        this.sprintcustomSce.search({query : this.activesprint.code}, )
            .subscribe(
                (res: ResponseWrapper) => this.getActiveSprintObj(res.json),
                (error) => console.log(error))
    }

    prepareSprint() {
        if (this.activesprint === undefined) {
            // count total sprints created in this board
            console.log('count related SPrints ' + this.relatedSprintsBoard.length )
            this.numSprintsParentBoard = this.countRelatedSprints + 1;

            // prepare the new sprint
            this.activesprint = new SprintCustom();
            this.activesprint.code = this.boardcustom.code + '_' + 'Sprint' + '_' + this.numSprintsParentBoard;
            this.activesprint.name = this.boardcustom.code + '_' + 'Sprint' + '_' + this.numSprintsParentBoard;
            this.activesprint.board = this.boardcustom;

            this.isSaving = true;
            if (this.activesprint.id === undefined) {
                this.subscribeToSaveResponse(
                    this.sprintcustomSce.create(this.activesprint));
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

    private onSaveSuccess(result: BoardCustom) {
        this.eventManager.broadcast({ name: 'sprintcustomsListModification', content: 'OK'});
        this.isSaving = false;
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private getActiveSprintObj(data) {
        for (let res of data) {
            this.activesprint = res.valueOf();
            console.log(this.activesprint.id)
        }
    }

    private getRelatedSprints(data, headers) {
        this.totalItems = headers.get('X-Total-Count');
        this.countRelatedSprints = parseInt(this.totalItems, 10);

        console.log('count ' + this.countRelatedSprints)
        this.relatedSprintsBoard = data.valueOf();

        console.log(this.relatedSprintsBoard);

        this.lookForActiveSprint();
    }

    dragStart(ev) {
        ev.dataTransfer.setData('text', ev.target.id);
        console.log(ev.target.id);
    }

    allowDrop($event) {
        $event.preventDefault();
    }

    drag(ev) {
        ev.dataTransfer.setData('text', ev.target.id);
    }

    drop(ev) {
        ev.preventDefault();
        // tslint:disable-next-line:prefer-const
        let data = ev.dataTransfer.getData('text');
        ev.target.appendChild(document.getElementById(data));
        // console.log(document.getElementById(data).id);

        for (let issue of this.issueCustoms) {
            if (issue.id === document.getElementById(data).id) {
                this.chosenIssues.push(issue);
                console.log(issue.code);
                console.log('chosen : ' + this.chosenIssues.length);
            }
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

}
