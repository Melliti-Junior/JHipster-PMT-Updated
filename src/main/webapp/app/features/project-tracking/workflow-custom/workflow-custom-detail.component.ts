import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {JhiEventManager} from 'ng-jhipster';

import {WorkflowCustom} from './workflow-custom.model';
import {WorkflowCustomService} from './workflow-custom.service';
import {IssueCustomService} from '../issue-custom/issue-custom.service';
import {TransitionCustom} from '../transition-custom/transition-custom.model';
import {TransitionCustomService} from '../transition-custom/transition-custom.service';
import {StepCustom} from '../step-custom/step-custom.model';
import {StepCustomService} from '../step-custom/step-custom.service';
import {MenuItem} from 'primeng/api';

@Component({
    selector: 'jhi-workflow-custom-detail',
    templateUrl: './workflow-custom-detail.component.html',
    styleUrls: ['./workflow-custom-detail.component.css']
})
export class WorkflowCustomDetailComponent implements OnInit, OnDestroy, AfterViewInit {

    workflowcustom: WorkflowCustom;

    relatedTransitions: TransitionCustom[];
    Alltransitions: TransitionCustom[];

    relatedSteps: StepCustom[];
    Allsteps: StepCustom[];

    workflowItems: MenuItem[];

    myTransitions = false;
    mySteps = false;

    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private workflowcustomSce: WorkflowCustomService,
        private route: ActivatedRoute,
        private issuecustomSce: IssueCustomService,
        private transitioncustomSce: TransitionCustomService,
        private stepcustomSce: StepCustomService,
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInWorkflowCustoms();
        this.loadAttributes();

        this.workflowItems = [
            {
                label: 'Steps', icon: 'fa-circle-o', command: (onclick) => {
                    this.mySteps = true;
                    this.myTransitions = false;
                    this.getRelatedSteps();
                }},
            {
                label: 'Transitions', icon: 'fa-arrow-right', command: (onclick) => {
                    this.mySteps = false;
                    this.myTransitions = true;
                    this.getRelatedTransitions();
                }},
        ];
        setTimeout(() => {
            if (this.workflowcustom) {
                this.mySteps = true;
            }
            this.getRelatedTransitions();
            this.getRelatedSteps();
        }, 500);
    }

    ngAfterViewInit() {
        console.log('finish');
        // let BacklogBtnID = document.getElementById('backlog').click();
    }

    load(id) {
        this.workflowcustomSce.find(id).subscribe((workflowcustom) => {
            this.workflowcustom = workflowcustom;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInWorkflowCustoms() {
        this.eventSubscriber = this.eventManager.subscribe(
            'workflowcustomListModification',
            (response) => this.load(this.workflowcustom.id)
        );
    }

    private loadAttributes() {
        this.getAllSteps();
        this.getAllTransitions();
    }

    getAllTransitions() {
        this.transitioncustomSce.getTransitionCustoms()
            .then((transitioncustoms) => this.Alltransitions = transitioncustoms );
    }

    getAllSteps() {
        this.stepcustomSce.getStepCustoms()
            .then((stepcustoms) => this.Allsteps = stepcustoms );
    }

    getRelatedTransitions() {
        this.relatedTransitions = new Array<TransitionCustom>();
        for (let trans of this.Alltransitions) {
            if (trans.workflow.id === this.workflowcustom.id) {
                if (this.relatedTransitions.indexOf(trans) === -1) {
                    this.relatedTransitions.push(trans);
                }
            }
        }
    }

    getRelatedSteps() {
        this.relatedSteps = new Array<StepCustom>();
        for (let step of this.Allsteps) {
            if (step.workflow.id === this.workflowcustom.id) {
                if (this.relatedSteps.indexOf(step) === -1) {
                    this.relatedSteps.push(step);
                }
            }
        }
    }
}
