import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {JhiEventManager} from 'ng-jhipster';

import {StepCustom} from './step-custom.model';
import {StepCustomPopupService} from './step-custom-popup.service';
import {StepCustomService} from './step-custom.service';

@Component({
    selector: 'jhi-step-custom-delete-dialog',
    templateUrl: './step-custom-delete-dialog.component.html'
})
export class StepCustomDeleteDialogComponent {

    stepcustom: StepCustom;

    constructor(
        private stepcustomService: StepCustomService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: string) {
        this.stepcustomService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'stepcustomsListModification',
                content: 'Deleted an step'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-step-custom-delete-popup',
    template: ''
})
export class StepCustomDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private stepcustomPopupService: StepCustomPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.stepcustomPopupService
                .open(StepCustomDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
