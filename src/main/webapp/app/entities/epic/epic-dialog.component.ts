import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Epic } from './epic.model';
import { EpicPopupService } from './epic-popup.service';
import { EpicService } from './epic.service';

@Component({
    selector: 'jhi-epic-dialog',
    templateUrl: './epic-dialog.component.html'
})
export class EpicDialogComponent implements OnInit {

    epic: Epic;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private epicService: EpicService,
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
        if (this.epic.id !== undefined) {
            this.subscribeToSaveResponse(
                this.epicService.update(this.epic));
        } else {
            this.subscribeToSaveResponse(
                this.epicService.create(this.epic));
        }
    }

    private subscribeToSaveResponse(result: Observable<Epic>) {
        result.subscribe((res: Epic) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: Epic) {
        this.eventManager.broadcast({ name: 'epicListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-epic-popup',
    template: ''
})
export class EpicPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private epicPopupService: EpicPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.epicPopupService
                    .open(EpicDialogComponent as Component, params['id']);
            } else {
                this.epicPopupService
                    .open(EpicDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
