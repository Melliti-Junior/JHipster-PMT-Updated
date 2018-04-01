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

}
