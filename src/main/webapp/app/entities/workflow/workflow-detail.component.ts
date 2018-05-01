import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { Workflow } from './workflow.model';
import { WorkflowService } from './workflow.service';

@Component({
    selector: 'jhi-workflow-detail',
    templateUrl: './workflow-detail.component.html'
})
export class WorkflowDetailComponent implements OnInit, OnDestroy {

    workflow: Workflow;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private workflowService: WorkflowService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInWorkflows();
    }

    load(id) {
        this.workflowService.find(id).subscribe((workflow) => {
            this.workflow = workflow;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInWorkflows() {
        this.eventSubscriber = this.eventManager.subscribe(
            'workflowListModification',
            (response) => this.load(this.workflow.id)
        );
    }
}
