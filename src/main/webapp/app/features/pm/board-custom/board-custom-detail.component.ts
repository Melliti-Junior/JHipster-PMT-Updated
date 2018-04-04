import {Component, OnInit, OnDestroy, AfterViewInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { BoardCustom } from './board-custom.model';
import { BoardCustomService } from './board-custom.service';
import {IssueCustom} from '../issue-custom';
import {IssueCustomService} from '../issue-custom/issue-custom.service';

@Component({
    selector: 'jhi-board-custom-detail',
    templateUrl: './board-custom-detail.component.html',
    styleUrls: ['./board-custom-detail.component.css']
})
export class BoardCustomDetailComponent implements OnInit, OnDestroy, AfterViewInit {

    boardcustom: BoardCustom;
    issueCustoms: IssueCustom[] = new Array<IssueCustom>();
    relatedissuecustoms: IssueCustom[] = new Array<IssueCustom>();

    chosenIssues: IssueCustom[] = new Array<IssueCustom>();

    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private boardcustomSce: BoardCustomService,
        private route: ActivatedRoute,
        private issuecustomSce: IssueCustomService,
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
        this.getProjectIssues();
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
    }

    getProjectIssues() {
        // let index = 0;
        this.relatedissuecustoms = new Array<IssueCustom>();
        this.loadAttributes();
        // let found = false;
        for (let issue of this.issueCustoms) {
            if (issue.project.name === this.boardcustom.project.name) {
                this.relatedissuecustoms.push(issue);
                // this.parentProject = this.projects[index];
                // this.projectcode = this.projects[index].code;
                // this.issuecustom.project = this.projects[index];
            }
        }
        /*
        while (index < this.issueCustoms.length && found === false)  {
            if ((this.issueCustoms[index]).project.name === this.boardcustom.project.name) {
                found = true;
                this.relatedissuecustoms.push(this.issueCustoms[index]);
                // this.parentProject = this.projects[index];
                // this.projectcode = this.projects[index].code;
                // this.issuecustom.project = this.projects[index];
            } else {
                index = index + 1;
            }
        }
        */
        console.log('Actual : ' + this.relatedissuecustoms.length);
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
                console.log(this.chosenIssues.length);
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
