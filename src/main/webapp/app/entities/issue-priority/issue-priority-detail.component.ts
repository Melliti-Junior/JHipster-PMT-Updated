import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { IssuePriority } from './issue-priority.model';
import { IssuePriorityService } from './issue-priority.service';

@Component({
    selector: 'jhi-issue-priority-detail',
    templateUrl: './issue-priority-detail.component.html'
})
export class IssuePriorityDetailComponent implements OnInit, OnDestroy {

    issuePriority: IssuePriority;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private issuePriorityService: IssuePriorityService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInIssuePriorities();
    }

    load(id) {
        this.issuePriorityService.find(id).subscribe((issuePriority) => {
            this.issuePriority = issuePriority;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInIssuePriorities() {
        this.eventSubscriber = this.eventManager.subscribe(
            'issuePriorityListModification',
            (response) => this.load(this.issuePriority.id)
        );
    }
}
