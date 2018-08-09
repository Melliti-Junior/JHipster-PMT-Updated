import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Response} from '@angular/http';

import {Observable} from 'rxjs/Observable';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {JhiEventManager} from 'ng-jhipster';

import {TransitionCustom} from './transition-custom.model';
import {TransitionCustomPopupService} from './transition-custom-popup.service';
import {TransitionCustomService} from './transition-custom.service';
import {TransitionCustomComponent} from './transition-custom.component';
import 'rxjs/add/observable/throw';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import {StatusCustom} from '../status-custom/status-custom.model';
import {WorkflowCustom, WorkflowCustomService} from '../workflow-custom';
import {StepCustom} from '../step-custom/step-custom.model';
import {StepCustomService} from '../step-custom/step-custom.service';

@Component({
    selector: 'jhi-transition-custom-dialog',
    templateUrl: './transition-custom-dialog.component.html',
    providers: [TransitionCustomComponent ],
})
export class TransitionCustomDialogComponent implements OnInit {

    transitioncustom: TransitionCustom;
    isSaving: boolean;
    startDateDp: any;
    endDateDp: any;

    statuscustoms: StatusCustom[];
    stepcustoms: StepCustom[];
    workflowcustoms: WorkflowCustom[];
    transitionCustoms: TransitionCustom[];
    possibleSteps: StepCustom[];

    // Get the status related to this transition
    parentStatus: StatusCustom;
    // Get the statusname chosen from list (combobox)
    sourceStepName: string;
    targetStepName: string;
    workflowName: string;
    parentWorkflow: WorkflowCustom;
    // statuscode: string;

    now = new Date();

    constructor(
        public activeModal: NgbActiveModal,
        private transitioncustomService: TransitionCustomService,
        private eventManager: JhiEventManager,
        private stepSce: StepCustomService,
        private workflowSce: WorkflowCustomService,
        // private comp: TransitionCustomComponent
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
     * @memberof TransitionCustomDialogComponent
     */
    private loadAttributes() {
        this.stepSce.getStepCustoms()
        .then((stepcustoms) => this.stepcustoms = stepcustoms );
        this.workflowSce.getWorkflowCustoms()
            .then((workflowcustoms) => this.workflowcustoms = workflowcustoms );
    }

    findSourceStep() {
        let index = 0;
        let found = false;

        while (index < this.stepcustoms.length && found === false)  {
            if ((this.stepcustoms[index]).name === this.sourceStepName) {
                found = true;
                this.transitioncustom.sourceStep = this.stepcustoms[index];
            } else {
                index = index + 1;
            }
        }
        console.log('aff' + this.transitioncustom.sourceStep.name);
    }

    findTargetStep() {
        let index = 0;
        let found = false;

        while (index < this.stepcustoms.length && found === false)  {
            if ((this.stepcustoms[index]).name === this.targetStepName) {
                found = true;
                this.transitioncustom.targetStep = this.stepcustoms[index];
            } else {
                index = index + 1;
            }
        }
        console.log('aff' + this.transitioncustom.targetStep.name);
    }

    findWorkflow() {
        let index = 0;
        let found = false;

        while (index < this.workflowcustoms.length && found === false)  {
            if ((this.workflowcustoms[index]).name === this.workflowName) {
                found = true;
                this.parentWorkflow = this.workflowcustoms[index];
                this.transitioncustom.workflow = this.workflowcustoms[index];
                this.possibleSteps = new Array<StepCustom>();
                this.getWorkflowRelatedSteps()
            } else {
                index = index + 1;
            }
        }
        console.log('aff' + this.transitioncustom.workflow.name);
    }

    getWorkflowRelatedSteps() {
        // console.log('poss prj ver' + this.possibleVersions.length);
        for (let step of this.stepcustoms) {
            console.log(step.workflow.name);
            console.log(this.parentWorkflow.name);
            if ((step.workflow.name === this.parentWorkflow.name) ) {
                this.possibleSteps.push(step);
            }
        }
        console.log('poss steps' + this.possibleSteps.length);
    }

    save() {
        this.isSaving = true;
        if (this.transitioncustom.id !== undefined) {
            this.subscribeToSaveResponse(
                this.transitioncustomService.update(this.transitioncustom));
        } else {
            // Activate last created Transition by default
            // this.transitioncustom.isActive = true;
            this.subscribeToSaveResponse(
                this.transitioncustomService.create(this.transitioncustom));
        }
    }

    private subscribeToSaveResponse(result: Observable<TransitionCustom>) {
        result.subscribe((res: TransitionCustom) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: TransitionCustom) {
        this.eventManager.broadcast({ name: 'transitioncustomsListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

}

@Component({
    selector: 'jhi-transition-custom-popup',
    template: ''
})
export class TransitionCustomPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private transitioncustomPopupService: TransitionCustomPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.transitioncustomPopupService
                    .open(TransitionCustomDialogComponent as Component, params['id']);
            } else {
                this.transitioncustomPopupService
                    .open(TransitionCustomDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
