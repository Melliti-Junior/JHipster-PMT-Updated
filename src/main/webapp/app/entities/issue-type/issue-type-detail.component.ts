import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { IssueType } from './issue-type.model';
import { IssueTypeService } from './issue-type.service';

@Component({
    selector: 'jhi-issue-type-detail',
    templateUrl: './issue-type-detail.component.html'
})
export class IssueTypeDetailComponent implements OnInit, OnDestroy {

    issueType: IssueType;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private issueTypeService: IssueTypeService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInIssueTypes();
    }

    load(id) {
        this.issueTypeService.find(id).subscribe((issueType) => {
            this.issueType = issueType;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInIssueTypes() {
        this.eventSubscriber = this.eventManager.subscribe(
            'issueTypeListModification',
            (response) => this.load(this.issueType.id)
        );
    }
}
