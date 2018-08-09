import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Response} from '@angular/http';

import {Observable} from 'rxjs/Observable';
import {NgbActiveModal, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {JhiEventManager} from 'ng-jhipster';

import {VersionCustom} from './version-custom.model';
import {VersionCustomPopupService} from './version-custom-popup.service';
import {VersionCustomService} from './version-custom.service';
import {VersionCustomComponent} from './version-custom.component';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import {ProjectCustom} from '../project-custom';
import {ProjectCustomService} from '../project-custom/project-custom.service';

@Component({
    selector: 'jhi-version-custom-dialog',
    templateUrl: './version-custom-dialog.component.html',
    providers: [VersionCustomComponent ],
})
export class VersionCustomDialogComponent implements OnInit {

    versioncustom: VersionCustom;
    isSaving: boolean;
    startDateDp: any;
    releaseDateDp: any;

    projects: ProjectCustom[];
    versionCustoms: VersionCustom[];

    // Get the project related to this version
    parentProject: ProjectCustom;
    // Get the projectname chosen from list (combobox)
    projectname: string;
    // projectcode: string;

    theDate: NgbDateStruct;
    now = new Date();

    constructor(
        public activeModal: NgbActiveModal,
        private versioncustomService: VersionCustomService,
        private eventManager: JhiEventManager,
        private projectSce: ProjectCustomService,
        // private comp: VersionCustomComponent
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.loadAttributes();
        this.theDate = {year: this.now.getFullYear(), month: this.now.getMonth() + 1, day: this.now.getDate()};
        // this.versioncustom.dueDate = this.theDate;
        console.log(this.theDate);
        // this.getEpicNames();
        // this.setDefaultAttributes();
        // this.countParentProjectVersions();
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    findProject() {
        let index = 0;
        let found = false;
        while (index < this.projects.length && found === false)  {
            if ((this.projects[index]).name === this.projectname) {
                found = true;
                this.parentProject = this.projects[index];
                // this.projectcode = this.projects[index].code;
                this.versioncustom.project = this.projects[index];
            } else {
                index = index + 1;
            }
        }
        console.log('aff' + this.versioncustom.project.name);
    }

    /**
     * This function retrieves all existing Epics, Types and Priorities
     *
     * @private
     * @memberof VersionCustomDialogComponent
     */
    private loadAttributes() {
        this.projectSce.getProjects()
        .then((projects) => this.projects = projects );
        this.versioncustomService.getVersionCustoms()
        .then((versionCustoms) => this.versionCustoms = versionCustoms );
    }

    save() {
        this.isSaving = true;
        if (this.versioncustom.id !== undefined) {
            this.subscribeToSaveResponse(
                this.versioncustomService.update(this.versioncustom));
        } else {
            this.subscribeToSaveResponse(
                this.versioncustomService.create(this.versioncustom));
        }
    }

    private subscribeToSaveResponse(result: Observable<VersionCustom>) {
        result.subscribe((res: VersionCustom) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: VersionCustom) {
        this.eventManager.broadcast({ name: 'versioncustomsListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

}

@Component({
    selector: 'jhi-version-custom-popup',
    template: ''
})
export class VersionCustomPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private versioncustomPopupService: VersionCustomPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.versioncustomPopupService
                    .open(VersionCustomDialogComponent as Component, params['id']);
            } else {
                this.versioncustomPopupService
                    .open(VersionCustomDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
