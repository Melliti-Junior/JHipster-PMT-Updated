import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Sprint } from './sprint.model';
import { SprintPopupService } from './sprint-popup.service';
import { SprintService } from './sprint.service';

@Component({
    selector: 'jhi-sprint-dialog',
    templateUrl: './sprint-dialog.component.html'
})
export class SprintDialogComponent implements OnInit {

    sprint: Sprint;
    isSaving: boolean;
    startDateDp: any;
    endDateDp: any;

    constructor(
        public activeModal: NgbActiveModal,
        private sprintService: SprintService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.sprint.id !== undefined) {
            this.subscribeToSaveResponse(
                this.sprintService.update(this.sprint));
        } else {
            this.subscribeToSaveResponse(
                this.sprintService.create(this.sprint));
        }
    }

    private subscribeToSaveResponse(result: Observable<Sprint>) {
        result.subscribe((res: Sprint) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: Sprint) {
        this.eventManager.broadcast({ name: 'sprintListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-sprint-popup',
    template: ''
})
export class SprintPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private sprintPopupService: SprintPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.sprintPopupService
                    .open(SprintDialogComponent as Component, params['id']);
            } else {
                this.sprintPopupService
                    .open(SprintDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
