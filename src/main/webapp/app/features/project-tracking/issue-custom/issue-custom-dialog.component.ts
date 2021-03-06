import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Response} from '@angular/http';

import {Observable} from 'rxjs/Observable';
import {NgbActiveModal, NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {JhiDateUtils, JhiEventManager} from 'ng-jhipster';

import {IssueCustom} from './issue-custom.model';
import {IssueCustomPopupService} from './issue-custom-popup.service';
import {IssueCustomService} from './issue-custom.service';
import {Epic, EpicService} from '../../../entities/epic';
import {IssuePriority, IssuePriorityService} from '../../../entities/issue-priority';
import {IssueType, IssueTypeService} from '../../../entities/issue-type';
import {IssueCustomComponent} from './issue-custom.component';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import {Resolution} from '../../../entities/resolution/resolution.model';
import {ResolutionService} from '../../../entities/resolution';
import {ProjectCustom} from '../project-custom';
import {ProjectCustomService} from '../project-custom/project-custom.service';
import {VersionCustom, VersionCustomService} from '../version-custom';
import {Principal, User, UserService} from '../../../shared';
import {StatusCustom, StatusCustomService} from '../status-custom';

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
    statuses: StatusCustom[];
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

    currentAccount: any;
    users: User[];

    constructor(
        public activeModal: NgbActiveModal,
        private issuecustomService: IssueCustomService,
        private eventManager: JhiEventManager,
        private typeSce: IssueTypeService,
        private prioritySce: IssuePriorityService,
        private epicSce: EpicService,
        private statusSce: StatusCustomService,
        private resolutionSce: ResolutionService,
        private projectSce: ProjectCustomService,
        private versionSce: VersionCustomService,
        private dateUtils: JhiDateUtils,
        private ngbDateParserFormatter: NgbDateParserFormatter,
        private userSce: UserService,
        private principal: Principal,
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

        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    makeNewIssueUnresolved() {
        for (let resolution of this.resolutions) {
            if (resolution.name.toLowerCase() === 'unresolved') {
                this.issuecustom.resolution = resolution;
            }
        }
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

    findCurrentUser() {
        let index = 0;
        let found = false;
        while (index < this.users.length && found === false)  {
            if ((this.users[index]).login.toLowerCase() === this.currentAccount.login.toLowerCase()) {
                found = true;
                this.issuecustom.reporter = this.users[index];
            } else {
                index = index + 1;
            }
        }
        console.log('aff' + this.issuecustom.reporter.login);
    }

    findStatusCustom() {
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
        // this.issuecustom.version = new CustomVersion();
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
        this.statusSce.getStatusCustoms()
        .then((statuses) => this.statuses = statuses );
        this.projectSce.getProjects()
        .then((projects) => this.projects = projects );
        this.issuecustomService.getIssueCustoms()
        .then((issueCustoms) => this.issueCustoms = issueCustoms );
        this.versionSce.getVersionCustoms()
            .then((versions) => this.versions = versions );
        this.userSce.getUsers()
            .then((users) => this.users = users );
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
            // Set the status Unresolved
            this.makeNewIssueUnresolved();
            // Create the new Issue
            this.findCurrentUser();
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
