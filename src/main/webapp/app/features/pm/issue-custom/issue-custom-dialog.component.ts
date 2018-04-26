import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import {NgbActiveModal, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {JhiDateUtils, JhiEventManager} from 'ng-jhipster';

import { IssueCustom } from './issue-custom.model';
import { IssueCustomPopupService } from './issue-custom-popup.service';
import { IssueCustomService } from './issue-custom.service';
import { EpicService, Epic } from '../../../entities/epic';
import { IssuePriorityService, IssuePriority } from '../../../entities/issue-priority';
import { IssueTypeService, IssueType } from '../../../entities/issue-type';
import { IssueCustomComponent } from './issue-custom.component';
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
import {VersionCustom, VersionCustomService} from '../version-custom';
import {ResponseWrapper} from '../../../shared';

@Component({
    selector: 'jhi-issue-custom-dialog',
    templateUrl: './issue-custom-dialog.component.html',
    providers: [IssueCustomComponent ],
})
export class IssueCustomDialogComponent implements OnInit {

    issuecustom: IssueCustom;
    isSaving: boolean;
    createdDateDp: any;
    dueDateDp: any;

    types: IssueType[];
    priorities: IssuePriority[];
    epics: Epic[];
    statuses: Status[];
    resolutions: Resolution[];
    projects: ProjectCustom[];
    versions: VersionCustom[];
    possibleVersions: VersionCustom[];
    issueCustoms: IssueCustom[];

    typename: string;
    priorityname: string;
    epicname: string;
    statusname: string;
    resolutionname: string;
    // Get the project related to this issue
    parentProject: ProjectCustom;
    // Get the projectname chosen from list (combobox)
    projectname: string;
    // projectcode: string;
    versionname: string;

    epicnames: string[];
    numIssuesParentProj: number;

    theDate: NgbDateStruct;
    now = new Date();
    myDate: any;

    constructor(
        public activeModal: NgbActiveModal,
        private issuecustomService: IssueCustomService,
        private eventManager: JhiEventManager,
        private typeSce: IssueTypeService,
        private prioritySce: IssuePriorityService,
        private epicSce: EpicService,
        private statusSce: StatusService,
        private resolutionSce: ResolutionService,
        private projectSce: ProjectCustomService,
        private versionSce: VersionCustomService,
        private dateUtils: JhiDateUtils,
        private ngbDateParserFormatter: NgbDateParserFormatter,
        // private comp: IssueCustomComponent
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.loadAttributes();
        // this.theDate = {year: this.now.getFullYear(), month: this.now.getMonth() + 1, day: this.now.getDate()};
        this.theDate = {year: this.now.getFullYear(), month: this.now.getMonth() + 1, day: this.now.getDate()};
        // this.issuecustom.dueDate = this.theDate;
        console.log('ngB : ' + this.theDate);
        // this.getEpicNames();
        // this.setDefaultAttributes();
        // this.countParentProjectIssues();
        // let myDate = new Date(this.theDate.year, this.theDate.month-1, this.theDate.day);
        this.myDate = this.ngbDateParserFormatter.format(this.theDate);
        console.log('ngBParse : ' + this.myDate);

        this.statusSce.search({query : 'Open'})
            .subscribe(
                (res: ResponseWrapper) => this.getInitialStatus(res.json, res.headers),
                (error) => console.log(error))
        this.resolutionSce.search({query : 'Unresolved'})
            .subscribe(
                (res: ResponseWrapper) => this.getInitialResolution(res.json, res.headers),
                (error) => console.log(error))
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    findEpic() {
        // this.issuecustom.epic = this.epicSce.findByRequest('name=' + this.epicname);
        // console.log(this.issuecustom.epic.name);

        let index = 0;
        let found = false;
        while (index < this.epics.length && found === false)  {
            if ((this.epics[index]).name === this.epicname) {
                found = true;
                this.issuecustom.epic = this.epics[index];
            } else {
                index = index + 1;
            }
        }
        console.log('aff' + this.issuecustom.epic.name);
    }

    findType() {
        // this.issuecustom.type = this.typeSce.findByRequest('name=' + this.typename);
        // console.log(this.typename);
        // console.log(this.issuecustom.type + 'type');

        let index = 0;
        let found = false;
        while (index < this.types.length && found === false)  {
            if ((this.types[index]).name === this.typename) {
                found = true;
                this.issuecustom.type = this.types[index];
            } else {
                index = index + 1;
            }
        }
        console.log('aff' + this.issuecustom.type.name);
    }

    findPriority() {
        // this.issuecustom.priority = this.prioritySce.findByRequest('name=' + this.priorityname);
        // console.log(this.issuecustom.priority.name + 'prio');

        let index = 0;
        let found = false;
        while (index < this.priorities.length && found === false)  {
            if ((this.priorities[index]).name === this.priorityname) {
                found = true;
                this.issuecustom.priority = this.priorities[index];
            } else {
                index = index + 1;
            }
        }
        console.log('aff' + this.issuecustom.priority.name);
    }

    findStatus() {
        let index = 0;
        let found = false;
        while (index < this.statuses.length && found === false)  {
            if ((this.statuses[index]).name === this.statusname) {
                found = true;
                this.issuecustom.status = this.statuses[index];
            } else {
                index = index + 1;
            }
        }
        console.log('aff' + this.issuecustom.status.name);
    }

    findResolution() {
        let index = 0;
        let found = false;
        while (index < this.resolutions.length && found === false)  {
            if ((this.resolutions[index]).name === this.resolutionname) {
                found = true;
                this.issuecustom.resolution = this.resolutions[index];
            } else {
                index = index + 1;
            }
        }
        console.log('aff' + this.issuecustom.resolution.name);
    }

    countParentProjectIssues() {
        this.numIssuesParentProj = 0;
        // tslint:disable-next-line:prefer-const
        for (let issue of this.issueCustoms) {
            if ((issue.project !== null) && (issue.project.code === this.parentProject.code)) {
                this.numIssuesParentProj++;
            }
        }
        console.log('Num' + this.numIssuesParentProj + this.parentProject.code);
    }

    getProjectrelatedVersions() {
        // console.log('poss prj ver' + this.possibleVersions.length);
        for (let Ver of this.versions) {
            console.log(Ver.project.name);
            console.log(this.parentProject.name);
            if ((Ver.project.name === this.parentProject.name) ) {
                this.possibleVersions.push(Ver);
            }
        }
        console.log('poss ver' + this.possibleVersions.length);
    }

    findProject() {
        let index = 0;
        let found = false;
        while (index < this.projects.length && found === false)  {
            if ((this.projects[index]).name === this.projectname) {
                found = true;
                this.parentProject = this.projects[index];
                this.issuecustom.project = this.projects[index];
                // this.projectcode = this.projects[index].code;
                this.possibleVersions = new Array<VersionCustom>()
                this.getProjectrelatedVersions();
            } else {
                index = index + 1;
            }
        }
        console.log('aff' + this.issuecustom.project.name);
        // console.log('poss ver' + this.possibleVersions.length);

        this.countParentProjectIssues();
        // this.getProjectrelatedVersions();
    }

    findFixVersion() {
        // this.issuecustom.version = new VersionCustom();
        let index = 0;
        let found = false;
        while (index < this.possibleVersions.length && found === false)  {
            if ((this.possibleVersions[index]).name === this.versionname) {
                found = true;
                this.issuecustom.version = this.possibleVersions[index];
            } else {
                index = index + 1;
            }
        }
        console.log('aff' + this.issuecustom.version.name);
    }

    /**
     * This function retrieves all existing Epics, Types and Priorities
     *
     * @private
     * @memberof IssueCustomDialogComponent
     */
    private loadAttributes() {
        this.epicSce.getEpics()
        .then((epics) => this.epics = epics );
        this.typeSce.getTypes()
        .then((types) => this.types = types );
        this.prioritySce.getPriorities()
        .then((priorities) => this.priorities = priorities );
        this.resolutionSce.getResolutions()
        .then((resolutions) => this.resolutions = resolutions );
        this.statusSce.getStatuses()
        .then((statuses) => this.statuses = statuses );
        this.projectSce.getProjects()
        .then((projects) => this.projects = projects );
        this.issuecustomService.getIssueCustoms()
        .then((issueCustoms) => this.issueCustoms = issueCustoms );
        this.versionSce.getVersionCustoms()
            .then((versions) => this.versions = versions );
    }

    /**
     * Use ElasticSearch to find element by request
     *
     * @param {string} req
     * @memberof IssueCustomDialogComponent
     */
    findByname(name: string) {
        this.issuecustomService.findByRequest(name);
        // console.log(this.comp.issuecustoms);
    }

    getInitialStatus(data, header) {
        for (let status of data) {
            this.issuecustom.status = status;
        }
        // console.log(this.relatedSprintsBoard);

    }

    getInitialResolution(data, headers) {
        for (let resolution of data) {
            this.issuecustom.resolution = resolution;
        }
    }

    setDefaultAttributes() {
        let index = 0;
        let found = false;
        while (index < this.statuses.length && found === false)  {
            if ((this.statuses[index]).name === 'Open') {
                found = true;
                this.issuecustom.status = this.statuses[index];
            } else {
                index = index + 1;
            }
        }

        index = 0;
        found = false;
        while (index < this.resolutions.length && found === false)  {
            if ((this.resolutions[index]).name === 'Unresolved') {
                found = true;
                this.issuecustom.resolution = this.resolutions[index];
            } else {
                index = index + 1;
            }
        }
        console.log('aff' + this.issuecustom.resolution.name);
    }

    save() {
        this.isSaving = true;
        if (this.issuecustom.id !== undefined) {
            // Add the update Date
            this.issuecustom.updatedDate = this.theDate;
            // Configure the Issue Code on update if parent project is changed
            if ((this.parentProject !== undefined) && (this.parentProject.name !== this.issuecustom.project.name)) {
                console.log(this.numIssuesParentProj + 1);
                this.issuecustom.code = this.parentProject.code.toUpperCase() + '-' + (this.numIssuesParentProj + 1);
            }
            console.log('New Code : ' + this.issuecustom.code);

            this.subscribeToSaveResponse(
                this.issuecustomService.update(this.issuecustom));
        } else {
            // Add the creation Date
            this.issuecustom.createdDate = this.theDate;
            // Configure the Issue Code
            if (this.parentProject !== undefined) {
                console.log(this.numIssuesParentProj + 1);
                this.issuecustom.code = this.parentProject.code.toUpperCase() + '-' + (this.numIssuesParentProj + 1);
                console.log('New Code : ' + this.issuecustom.code);
            }
            this.subscribeToSaveResponse(
                this.issuecustomService.create(this.issuecustom));
        }
    }

    private subscribeToSaveResponse(result: Observable<IssueCustom>) {
        result.subscribe((res: IssueCustom) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: IssueCustom) {
        this.eventManager.broadcast({ name: 'issuecustomsListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

}

@Component({
    selector: 'jhi-issue-custom-popup',
    template: ''
})
export class IssueCustomPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private issuecustomPopupService: IssueCustomPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.issuecustomPopupService
                    .open(IssueCustomDialogComponent as Component, params['id']);
            } else {
                this.issuecustomPopupService
                    .open(IssueCustomDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
