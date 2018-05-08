import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { IssueCustom } from './issue-custom.model';
import { IssueCustomService } from './issue-custom.service';
import { IssueType } from '../../../entities/issue-type/issue-type.model';
import { IssuePriority } from '../../../entities/issue-priority';
import { Epic } from '../../../entities/epic';
import {StatusCustomService} from '../status-custom/status-custom.service';
import {StatusCustom} from '../status-custom/status-custom.model';
import {Observable} from "rxjs/Observable";
import {Response} from "@angular/http";

@Component({
    selector: 'jhi-issue-custom-detail',
    templateUrl: './issue-custom-detail.component.html',
    styleUrls: ['./issue-custom-detail.component.css']
})
export class IssueCustomDetailComponent implements OnInit, OnDestroy {

    issuecustom: IssueCustom;
    statuscustoms: StatusCustom[];
    isSaving: boolean;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private issuecustomService: IssueCustomService,
        private statusService: StatusCustomService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInIssueCustoms();
    }

    load(id) {
        this.issuecustomService.find(id).subscribe((issuecustom) => {
            this.issuecustom = issuecustom;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInIssueCustoms() {
        this.eventSubscriber = this.eventManager.subscribe(
            'issuecustomListModification',
            (response) => this.load(this.issuecustom.id)
        );
    }
}
