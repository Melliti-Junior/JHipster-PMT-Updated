import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Transition } from './transition.model';
import { TransitionPopupService } from './transition-popup.service';
import { TransitionService } from './transition.service';

@Component({
    selector: 'jhi-transition-dialog',
    templateUrl: './transition-dialog.component.html'
})
export class TransitionDialogComponent implements OnInit {

    transition: Transition;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private transitionService: TransitionService,
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
        if (this.transition.id !== undefined) {
            this.subscribeToSaveResponse(
                this.transitionService.update(this.transition));
        } else {
            this.subscribeToSaveResponse(
                this.transitionService.create(this.transition));
        }
    }

    private subscribeToSaveResponse(result: Observable<Transition>) {
        result.subscribe((res: Transition) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: Transition) {
        this.eventManager.broadcast({ name: 'transitionListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-transition-popup',
    template: ''
})
export class TransitionPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private transitionPopupService: TransitionPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.transitionPopupService
                    .open(TransitionDialogComponent as Component, params['id']);
            } else {
                this.transitionPopupService
                    .open(TransitionDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
