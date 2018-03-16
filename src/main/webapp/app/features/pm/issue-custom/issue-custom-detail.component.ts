import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { IssueCustom } from './issue-custom.model';
import { IssueCustomService } from './issue-custom.service';
import { IssueType } from '../../../entities/issue-type/issue-type.model';
import { IssuePriority } from '../../../entities/issue-priority';
import { Epic } from '../../../entities/epic';

@Component({
    selector: 'jhi-issue-custom-detail',
    templateUrl: './issue-custom-detail.component.html'
})
export class IssueCustomDetailComponent implements OnInit, OnDestroy {

    issuecustom: IssueCustom;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private issuecustomService: IssueCustomService,
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
