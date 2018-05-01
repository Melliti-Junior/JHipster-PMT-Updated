import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import {NgbActiveModal, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { WorkflowCustom } from './workflow-custom.model';
import { WorkflowCustomPopupService } from './workflow-custom-popup.service';
import { WorkflowCustomService } from './workflow-custom.service';
import { WorkflowCustomComponent } from './workflow-custom.component';
import 'rxjs/add/observable/throw';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import {IssueCustom} from '../issue-custom';
import {StatusCustom} from '../status-custom/status-custom.model';
import {StatusCustomService} from '../status-custom/status-custom.service';

@Component({
    selector: 'jhi-workflow-custom-dialog',
    templateUrl: './workflow-custom-dialog.component.html',
    providers: [WorkflowCustomComponent ],
})
export class WorkflowCustomDialogComponent implements OnInit {

    workflowcustom: WorkflowCustom;
    isSaving: boolean;
    startDateDp: any;
    endDateDp: any;

    statuscustoms: StatusCustom[];
    workflowCustoms: WorkflowCustom[];

    // Get the status related to this workflow
    parentStatus: StatusCustom;
    // Get the statusname chosen from list (combobox)
    statusname: string;
    // statuscode: string;

    now = new Date();

    constructor(
        public activeModal: NgbActiveModal,
        private workflowcustomService: WorkflowCustomService,
        private eventManager: JhiEventManager,
        private statusSce: StatusCustomService,
        // private comp: WorkflowCustomComponent
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.loadAttributes();
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    /**
     * This function retrieves all existing Epics, Types and Priorities
     *
     * @private
     * @memberof WorkflowCustomDialogComponent
     */
    private loadAttributes() {
        this.statusSce.getStatusCustoms()
        .then((statuscustoms) => this.statuscustoms = statuscustoms );
    }

    save() {
        this.isSaving = true;
        if (this.workflowcustom.id !== undefined) {
            this.subscribeToSaveResponse(
                this.workflowcustomService.update(this.workflowcustom));
        } else {
            // Activate last created Workflow by default
            // this.workflowcustom.isActive = true;
            this.subscribeToSaveResponse(
                this.workflowcustomService.create(this.workflowcustom));
        }
    }

    private subscribeToSaveResponse(result: Observable<WorkflowCustom>) {
        result.subscribe((res: WorkflowCustom) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: WorkflowCustom) {
        this.eventManager.broadcast({ name: 'workflowcustomsListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

}

@Component({
    selector: 'jhi-workflow-custom-popup',
    template: ''
})
export class WorkflowCustomPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private workflowcustomPopupService: WorkflowCustomPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.workflowcustomPopupService
                    .open(WorkflowCustomDialogComponent as Component, params['id']);
            } else {
                this.workflowcustomPopupService
                    .open(WorkflowCustomDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
