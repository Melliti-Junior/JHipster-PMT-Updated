import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ProjectCustom } from './project-custom.model';
import { ProjectCustomPopupService } from './project-custom-popup.service';
import { ProjectCustomService } from './project-custom.service';
import { Program, ProgramService } from '../../../entities/program';

@Component({
    selector: 'jhi-project-custom-dialog',
    templateUrl: './project-custom-dialog.component.html'
})
export class ProjectCustomDialogComponent implements OnInit {

    projectcustom: ProjectCustom;
    programs: Program[];
    programname: string;
    isSaving: boolean;
    startDateDp: any;
    endDateDp: any;

    constructor(
        public activeModal: NgbActiveModal,
        private projectcustomService: ProjectCustomService,
        private eventManager: JhiEventManager,
        private programSce: ProgramService,
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.loadAttributes();
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

    save() {
        this.isSaving = true;
        if (this.projectcustom.id !== undefined) {
            this.subscribeToSaveResponse(
                this.projectcustomService.update(this.projectcustom));
        } else {
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
