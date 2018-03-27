import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Resolution } from './resolution.model';
import { ResolutionPopupService } from './resolution-popup.service';
import { ResolutionService } from './resolution.service';

@Component({
    selector: 'jhi-resolution-dialog',
    templateUrl: './resolution-dialog.component.html'
})
export class ResolutionDialogComponent implements OnInit {

    resolution: Resolution;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private resolutionService: ResolutionService,
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
        if (this.resolution.id !== undefined) {
            this.subscribeToSaveResponse(
                this.resolutionService.update(this.resolution));
        } else {
            this.subscribeToSaveResponse(
                this.resolutionService.create(this.resolution));
        }
    }

    private subscribeToSaveResponse(result: Observable<Resolution>) {
        result.subscribe((res: Resolution) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: Resolution) {
        this.eventManager.broadcast({ name: 'resolutionListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-resolution-popup',
    template: ''
})
export class ResolutionPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private resolutionPopupService: ResolutionPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.resolutionPopupService
                    .open(ResolutionDialogComponent as Component, params['id']);
            } else {
                this.resolutionPopupService
                    .open(ResolutionDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
