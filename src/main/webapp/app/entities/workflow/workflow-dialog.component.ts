import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Workflow } from './workflow.model';
import { WorkflowPopupService } from './workflow-popup.service';
import { WorkflowService } from './workflow.service';

@Component({
    selector: 'jhi-workflow-dialog',
    templateUrl: './workflow-dialog.component.html'
})
export class WorkflowDialogComponent implements OnInit {

    workflow: Workflow;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private workflowService: WorkflowService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.workflow.id !== undefined) {
            this.subscribeToSaveResponse(
                this.workflowService.update(this.workflow));
        } else {
            this.subscribeToSaveResponse(
                this.workflowService.create(this.workflow));
        }
    }

    private subscribeToSaveResponse(result: Observable<Workflow>) {
        result.subscribe((res: Workflow) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: Workflow) {
        this.eventManager.broadcast({ name: 'workflowListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-workflow-popup',
    template: ''
})
export class WorkflowPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private workflowPopupService: WorkflowPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.workflowPopupService
                    .open(WorkflowDialogComponent as Component, params['id']);
            } else {
                this.workflowPopupService
                    .open(WorkflowDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
