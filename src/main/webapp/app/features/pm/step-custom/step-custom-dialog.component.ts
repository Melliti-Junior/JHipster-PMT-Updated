import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import {NgbActiveModal, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { StepCustom } from './step-custom.model';
import { StepCustomPopupService } from './step-custom-popup.service';
import { StepCustomService } from './step-custom.service';
import { StepCustomComponent } from './step-custom.component';
import 'rxjs/add/observable/throw';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import {IssueCustom} from '../issue-custom';
import {StatusCustom, StatusCustomService} from "../status-custom";

@Component({
    selector: 'jhi-step-custom-dialog',
    templateUrl: './step-custom-dialog.component.html',
    providers: [StepCustomComponent ],
})
export class StepCustomDialogComponent implements OnInit {

    stepcustom: StepCustom;
    isSaving: boolean;
    startDateDp: any;
    endDateDp: any;

    statuscustoms: StatusCustom[];
    stepCustoms: StepCustom[];

    // Get the status related to this step
    parentStatus: StatusCustom;
    // Get the statusname chosen from list (combobox)
    statusname: string;
    // statuscode: string;

    now = new Date();

    constructor(
        public activeModal: NgbActiveModal,
        private stepcustomService: StepCustomService,
        private eventManager: JhiEventManager,
        private statusSce: StatusCustomService,
        // private comp: StepCustomComponent
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.loadAttributes();
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    findStatus() {
        let index = 0;
        let found = false;

        while (index < this.statuscustoms.length && found === false)  {
            if ((this.statuscustoms[index]).name === this.statusname) {
                found = true;
                this.parentStatus = this.statuscustoms[index]
                console.log('parentstatus' + this.statuscustoms[index].name)
                // this.statuscode = this.statuss[index].code;
                this.stepcustom.status = this.statuscustoms[index];
            } else {
                index = index + 1;
            }
        }
        console.log('aff' + this.stepcustom.status.name);
    }

    /**
     * This function retrieves all existing Epics, Types and Priorities
     *
     * @private
     * @memberof StepCustomDialogComponent
     */
    private loadAttributes() {
        this.statusSce.getStatusCustoms()
        .then((statuscustoms) => this.statuscustoms = statuscustoms );
    }

    /**
     * Use ElasticSearch to find element by request
     *
     * @param {string} req
     * @memberof StepCustomDialogComponent
     */
    findByname(name: string) {
        this.stepcustomService.findByRequest(name);
        // console.log(this.comp.stepcustoms);
    }

    save() {
        this.isSaving = true;
        if (this.stepcustom.id !== undefined) {
            this.subscribeToSaveResponse(
                this.stepcustomService.update(this.stepcustom));
        } else {
            // Activate last created Step by default
            // this.stepcustom.isActive = true;
            this.subscribeToSaveResponse(
                this.stepcustomService.create(this.stepcustom));
        }
    }

    private subscribeToSaveResponse(result: Observable<StepCustom>) {
        result.subscribe((res: StepCustom) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: StepCustom) {
        this.eventManager.broadcast({ name: 'stepcustomsListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

}

@Component({
    selector: 'jhi-step-custom-popup',
    template: ''
})
export class StepCustomPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private stepcustomPopupService: StepCustomPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.stepcustomPopupService
                    .open(StepCustomDialogComponent as Component, params['id']);
            } else {
                this.stepcustomPopupService
                    .open(StepCustomDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
