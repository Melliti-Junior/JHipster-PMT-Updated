import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ResolutionCustom } from './resolution-custom.model';
import { ResolutionCustomPopupService } from './resolution-custom-popup.service';
import { ResolutionCustomService } from './resolution-custom.service';
import { EpicService, Epic } from '../../../entities/epic';
import { ResolutionCustomComponent } from './resolution-custom.component';
import 'rxjs/add/observable/throw';

import {NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { Status } from '../../../entities/status/status.model';
import { Resolution } from '../../../entities/resolution/resolution.model';
import { StatusService } from '../../../entities/status/status.service';
import { ResolutionService } from '../../../entities/resolution';
import { ProjectCustom } from '../project-custom';
import { ProjectCustomService } from '../project-custom/project-custom.service';

@Component({
    selector: 'jhi-resolution-custom-dialog',
    templateUrl: './resolution-custom-dialog.component.html',
    providers: [ResolutionCustomComponent ],
})
export class ResolutionCustomDialogComponent implements OnInit {

    resolutioncustom: ResolutionCustom;
    isSaving: boolean;
    startDateDp: any;
    releaseDateDp: any;

    projects: ProjectCustom[];
    resolutionCustoms: ResolutionCustom[];

    // Get the project related to this resolution
    parentProject: ProjectCustom;
    // Get the projectname chosen from list (combobox)
    projectname: string;
    // projectcode: string;

    theDate: NgbDateStruct;
    now = new Date();

    constructor(
        public activeModal: NgbActiveModal,
        private resolutioncustomService: ResolutionCustomService,
        private eventManager: JhiEventManager,
        private projectSce: ProjectCustomService,
        // private comp: ResolutionCustomComponent
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.loadAttributes();
        this.theDate = {year: this.now.getFullYear(), month: this.now.getMonth() + 1, day: this.now.getDate()};
        // this.resolutioncustom.dueDate = this.theDate;
        console.log(this.theDate);
        // this.getEpicNames();
        // this.setDefaultAttributes();
        // this.countParentProjectResolutions();
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    /**
     * This function retrieves all existing Epics, Types and Priorities
     *
     * @private
     * @memberof ResolutionCustomDialogComponent
     */
    private loadAttributes() {
        this.projectSce.getProjects()
        .then((projects) => this.projects = projects );
        this.resolutioncustomService.getResolutionCustoms()
        .then((resolutionCustoms) => this.resolutionCustoms = resolutionCustoms );
    }

    /**
     * Use ElasticSearch to find element by request
     *
     * @param {string} req
     * @memberof ResolutionCustomDialogComponent
     */
    findByname(name: string) {
        this.resolutioncustomService.findByRequest(name);
        // console.log(this.comp.resolutioncustoms);
    }

    save() {
        this.isSaving = true;
        if (this.resolutioncustom.id !== undefined) {
            this.subscribeToSaveResponse(
                this.resolutioncustomService.update(this.resolutioncustom));
        } else {
            this.subscribeToSaveResponse(
                this.resolutioncustomService.create(this.resolutioncustom));
        }
    }

    private subscribeToSaveResponse(result: Observable<ResolutionCustom>) {
        result.subscribe((res: ResolutionCustom) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: ResolutionCustom) {
        this.eventManager.broadcast({ name: 'resolutioncustomsListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

}

@Component({
    selector: 'jhi-resolution-custom-popup',
    template: ''
})
export class ResolutionCustomPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private resolutioncustomPopupService: ResolutionCustomPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.resolutioncustomPopupService
                    .open(ResolutionCustomDialogComponent as Component, params['id']);
            } else {
                this.resolutioncustomPopupService
                    .open(ResolutionCustomDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
