import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Transition } from './transition.model';
import { TransitionPopupService } from './transition-popup.service';
import { TransitionService } from './transition.service';

@Component({
    selector: 'jhi-transition-delete-dialog',
    templateUrl: './transition-delete-dialog.component.html'
})
export class TransitionDeleteDialogComponent {

    transition: Transition;

    constructor(
        private transitionService: TransitionService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: string) {
        this.transitionService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'transitionListModification',
                content: 'Deleted an transition'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-transition-delete-popup',
    template: ''
})
export class TransitionDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private transitionPopupService: TransitionPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.transitionPopupService
                .open(TransitionDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
