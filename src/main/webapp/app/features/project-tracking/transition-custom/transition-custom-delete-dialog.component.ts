import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {JhiEventManager} from 'ng-jhipster';

import {TransitionCustom} from './transition-custom.model';
import {TransitionCustomPopupService} from './transition-custom-popup.service';
import {TransitionCustomService} from './transition-custom.service';

@Component({
    selector: 'jhi-transition-custom-delete-dialog',
    templateUrl: './transition-custom-delete-dialog.component.html'
})
export class TransitionCustomDeleteDialogComponent {

    transitioncustom: TransitionCustom;

    constructor(
        private transitioncustomService: TransitionCustomService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: string) {
        this.transitioncustomService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'transitioncustomsListModification',
                content: 'Deleted an transition'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-transition-custom-delete-popup',
    template: ''
})
export class TransitionCustomDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private transitioncustomPopupService: TransitionCustomPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.transitioncustomPopupService
                .open(TransitionCustomDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
