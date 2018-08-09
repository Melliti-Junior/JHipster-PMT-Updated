import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Response} from '@angular/http';

import {Observable} from 'rxjs/Observable';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {JhiEventManager} from 'ng-jhipster';

import {ProjectCustom} from './project-custom.model';
import {ProjectCustomPopupService} from './project-custom-popup.service';
import {ProjectCustomService} from './project-custom.service';
import {Program, ProgramService} from '../../../entities/program';
import {WorkflowCustom} from '../workflow-custom/workflow-custom.model';
import {WorkflowCustomService} from '../workflow-custom/workflow-custom.service';
import {Principal, User, UserService} from '../../../shared';

@Component({
    selector: 'jhi-project-custom-dialog',
    templateUrl: './project-custom-dialog.component.html'
})
export class ProjectCustomDialogComponent implements OnInit {

    projectcustom: ProjectCustom;
    programs: Program[];
    processes: WorkflowCustom[];
    currentAccount: any;
    users: User[];
    programname: string;
    processname: string;
    isSaving: boolean;
    startDateDp: any;
    endDateDp: any;

    constructor(
        public activeModal: NgbActiveModal,
        private projectcustomService: ProjectCustomService,
        private eventManager: JhiEventManager,
        private programSce: ProgramService,
        private processSce: WorkflowCustomService,
        private userSce: UserService,
        private principal: Principal,
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.loadAttributes();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    findProgram() {
        let index = 0;
        let found = false;
        while (index < this.programs.length && found === false)  {
            if ((this.programs[index]).name === this.programname) {
                found = true;
                this.projectcustom.program = this.programs[index];
            } else {
                index = index + 1;
            }
        }
        console.log('aff' + this.projectcustom.program.name);
    }

    findProcess() {
        let index = 0;
        let found = false;
        while (index < this.processes.length && found === false)  {
            if ((this.processes[index]).name === this.processname) {
                found = true;
                this.projectcustom.process = this.processes[index];
            } else {
                index = index + 1;
            }
        }
        console.log('aff' + this.projectcustom.process.name);
    }

    findCurrentUser() {
        let index = 0;
        let found = false;
        while (index < this.users.length && found === false)  {
            if ((this.users[index]).login.toLowerCase() === this.currentAccount.login.toLowerCase()) {
                found = true;
                this.projectcustom.lead = this.users[index];
            } else {
                index = index + 1;
            }
        }
        console.log('aff' + this.projectcustom.lead.login);
    }

    save() {
        this.isSaving = true;
        if (this.projectcustom.id !== undefined) {
            this.subscribeToSaveResponse(
                this.projectcustomService.update(this.projectcustom));
        } else {
            this.findCurrentUser();
            this.subscribeToSaveResponse(
                this.projectcustomService.create(this.projectcustom));
        }
    }

    private subscribeToSaveResponse(result: Observable<ProjectCustom>) {
        result.subscribe((res: ProjectCustom) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: ProjectCustom) {
        this.eventManager.broadcast({ name: 'projectcustomListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    /**
     * This function retrieves all existing Epics, Types and Priorities
     *
     * @private
     * @memberof ProjectCustomDialogComponent
     */
    private loadAttributes() {
        this.programSce.getPrograms()
        .then((programs) => this.programs = programs );
        this.processSce.getWorkflowCustoms()
            .then((processes) => this.processes = processes );
        this.userSce.getUsers()
            .then((users) => this.users = users );
    }
}

@Component({
    selector: 'jhi-project-custom-popup',
    template: ''
})
export class ProjectCustomPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private projectcustomPopupService: ProjectCustomPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.projectcustomPopupService
                    .open(ProjectCustomDialogComponent as Component, params['id']);
            } else {
                this.projectcustomPopupService
                    .open(ProjectCustomDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
