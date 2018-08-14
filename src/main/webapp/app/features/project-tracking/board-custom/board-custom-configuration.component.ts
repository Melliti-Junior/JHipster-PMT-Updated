import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {JhiEventManager} from 'ng-jhipster';
import {ColumnCustom} from '../column-custom/column-custom.model';
import {ColumnCustomService} from '../column-custom/column-custom.service';
import {BoardCustom} from './board-custom.model';
import {BoardCustomService} from './board-custom.service';
import {StatusCustom} from '../status-custom/status-custom.model';
import {StatusCustomService} from '../status-custom/status-custom.service';
import {Observable} from 'rxjs/Observable';
import {IssueCustom} from '../issue-custom';
import {Response} from '@angular/http';
import {TransitionCustomService} from '../transition-custom/transition-custom.service';
import {TransitionCustom} from '../transition-custom/transition-custom.model';
import {StepCustom} from '../step-custom/step-custom.model';
import {StepCustomService} from '../step-custom/step-custom.service';

@Component({
    selector: 'jhi-board-custom-configuration',
    templateUrl: './board-custom-configuration.component.html',
    styleUrls: ['./board-custom-configuration.component.css']
})
export class BoardCustomConfigurationComponent implements OnInit, OnDestroy {

    boardcustom: BoardCustom;
    allColumns: ColumnCustom[];
    currCol: ColumnCustom;
    allStatuses: StatusCustom[];
    relatedColumns: ColumnCustom[];
    relatedTransitions: TransitionCustom[];
    transitioncustoms: TransitionCustom[];
    relatedSteps: StepCustom[];
    stepcustoms: StepCustom[];
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    isSaving: boolean;

    constructor(
        private eventManager: JhiEventManager,
        private boardcustomService: BoardCustomService,
        private columncustomService: ColumnCustomService,
        private statusService: StatusCustomService,
        private transitionService: TransitionCustomService,
        private stepService: StepCustomService,
        private route: ActivatedRoute,
        private router: Router,
    ) {
    }

    ngOnInit() {
        // this.relatedColumns = new Array<CustomColumn>();
        this.allColumns = new Array<ColumnCustom>();

        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInBoardCustoms();
        this.loadAttributes();

        setTimeout(() => {
            this.lookForRelatedColumns();
            this.lookForRelatedTransitions();
            this.lookForRelatedSteps();
        }, 150);
    }

    load(id) {
        this.boardcustomService.find(id).subscribe((boardcustom) => {
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
            'boardcustomConfigModification',
            (response) => this.load(this.boardcustom.id)
        );
    }

    findSelectedColumn() {
        for (let col of this.relatedColumns) {
            if (col.board.id === this.boardcustom.id) {
                this.currCol = col;
            }
        }
    }

    lookForRelatedColumns() {
        this.relatedColumns = new Array<ColumnCustom>();
        for (let col of this.allColumns) {
            if (col.board) {
                console.log('col id' + col.board.code)
                console.log('board id' + this.boardcustom.code)
                if (col.board.code.toLowerCase() === this.boardcustom.code.toLowerCase()) {
                    if (this.relatedColumns.indexOf(col) === -1) {
                        this.relatedColumns.splice(col.order - 1, 0, col);
                    }
                }
            }
        }
        console.log(this.relatedColumns.length);
        this.findSelectedColumn();
    }

    loadAttributes() {
        this.getAllColumns();
        this.getAllStatuses();
        this.getAllSteps();
        this.getAllTransitions();
    }

    private getAllTransitions() {
        this.transitionService.getTransitionCustoms()
            .then((transitioncustoms) => this.transitioncustoms = transitioncustoms);
    }

    private getAllSteps() {
        this.stepService.getStepCustoms()
            .then((stepcustoms) => this.stepcustoms = stepcustoms);
    }

    private getAllStatuses() {
        this.statusService.getStatusCustoms()
            .then((allStatuses) => this.allStatuses = allStatuses);
    }

    private getAllColumns() {
        this.columncustomService.getColumnCustoms()
            .then((allColumns) => this.allColumns = allColumns);
    }

    lookForRelatedTransitions() {
        this.relatedTransitions = new Array<TransitionCustom>();
        for (let trans of this.transitioncustoms) {
            if (trans.workflow.id === this.boardcustom.project.process.id) {
                if (this.relatedTransitions.indexOf(trans) === -1) {
                    this.relatedTransitions.push(trans);
                }
            }
        }
        console.error(this.relatedTransitions.length)
    }

    lookForRelatedSteps() {
        this.relatedSteps = new Array<StepCustom>();
        console.error(this.stepcustoms.length)

        for (let step of this.stepcustoms) {
            console.log('step wf ' + step.workflow.id + 'process ' + this.boardcustom.project.process.id)
            if (step.workflow.id === this.boardcustom.project.process.id) {
                if (this.relatedSteps.indexOf(step) === -1) {
                    this.relatedSteps.push(step);
                }
            }
        }
        console.error(this.relatedSteps.length)
    }

    /*
    lookForRelatedTransitions() {
        this.transitionService.search({query : this.boardcustom.project.process.id})
            .subscribe(
                (res: ResponseWrapper) => this.retrieveTransitions(res.json),
                (error) => console.log(error));
    }

    retrieveTransitions(data) {
        this.relatedTransitions = data;
        console.error('trans' +  this.relatedTransitions.length);
    }

    lookForRelatedSteps() {
        this.stepService.search({query : this.boardcustom.project.process.id})
            .subscribe(
                (res: ResponseWrapper) => this.retrieveSteps(res.json),
                (error) => console.log(error));
    }

    retrieveSteps(data) {
        this.relatedSteps = data;
        console.error('stepss' +  this.relatedSteps.length)
    }
    */

    getStepByStatus(status: StatusCustom): StepCustom {
        let targetStep: StepCustom;
        let index = 0;
        let found = false;
        while (found === false && index <= this.relatedSteps.length) {
            if ((this.relatedSteps[index].status.id === status.id)) {
                found = true;
                targetStep = this.relatedSteps[index];
            }
        }
        return targetStep;
    }

    dragStart(ev) {
        ev.dataTransfer.setData('text', ev.target.id);
    }

    allowDrop($event) {
        $event.preventDefault();
    }

    dragend(ev) {
        console.error('dragend starts here');

        let data = ev.dataTransfer.getData('text');

        console.error('dragend stops here');

    }

    drop(ev) {
        console.error('dropev starts here')
        ev.preventDefault();
        // tslint:disable-next-line:prefer-const
        let data = ev.dataTransfer.getData('text');
        ev.target.appendChild(document.getElementById(data));

        console.log('hello source ' + document.getElementById(data).id);

        console.log('hello target ' + ev.target.id);

        let comingStep = this.findDraggedStep(document.getElementById(data).id);
        console.log(' heyyyy step ' + comingStep.name)

        if (ev.target.id === 'unmappedStatus') {
            console.log('unmapped')
            this.mapStepToColumn(comingStep, null);
            document.getElementById(data).hidden = true;
        } else {
            let currentColumn = this.findCurrentColumn(ev);
            console.log(' oppaa  coll ' + currentColumn.name)

            this.mapStepToColumn(comingStep, currentColumn);
        }
    }

    findCurrentColumn(ev): ColumnCustom {
        let found = false;
        let index = 0;
        let currentCol = new ColumnCustom()
        while ((found === false) && (index <= this.allColumns.length)) {
            if (this.allColumns[index].id === ev.target.id) {
                found = true;
                currentCol = this.allColumns[index];
            } else {
                index = index + 1;
            }
        }
        return currentCol;
    }

    findDraggedStep(id): StepCustom {
        let found = false;
        let index = 0;
        let draggedStep = new StepCustom()
        while ((found === false) && (index <= this.relatedSteps.length)) {
            if (this.relatedSteps[index].id === id) {
                found = true;
                draggedStep = this.relatedSteps[index];
            } else {
                index = index + 1;
            }
        }
        return draggedStep;
    }

    mapStepToColumn(step: StepCustom, col: ColumnCustom) {
        step.column = col;

        this.isSaving = true;
        this.subscribeToSaveResponseStep(
            this.stepService.update(step));

        if (col !== null) {
            console.log('update ' + step.name + ' with col ' + step.column.name);
        } else {
            console.log('update ' + step.name + ' with col ' + typeof step.column);
        }
    }

    getStepPerColumn(col: ColumnCustom): StepCustom[] {
        let relatedStepsForCol = new Array<StepCustom>();
        for (let st of this.relatedSteps) {
            if (st.column.id === col.id) {
                if (relatedStepsForCol.indexOf(st) === -1) {
                    relatedStepsForCol.push(st)
                }
            }
        }
        return relatedStepsForCol;
    }

    private subscribeToSaveResponseStep(result: Observable<StepCustom>) {
        result.subscribe((res: StepCustom) =>
            this.onSaveSuccessStep(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccessStep(result: IssueCustom) {
        this.eventManager.broadcast({ name: 'stepcustomsListModification', content: 'OK'});
        this.isSaving = false;
    }

    private onSaveError() {
        this.isSaving = false;
    }
}
