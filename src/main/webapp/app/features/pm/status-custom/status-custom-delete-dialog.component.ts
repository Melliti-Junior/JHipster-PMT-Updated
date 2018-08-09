import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {JhiEventManager} from 'ng-jhipster';

import {StatusCustom} from './status-custom.model';
import {StatusCustomPopupService} from './status-custom-popup.service';
import {StatusCustomService} from './status-custom.service';

@Component({
    selector: 'jhi-status-custom-delete-dialog',
    templateUrl: './status-custom-delete-dialog.component.html'
})
export class StatusCustomDeleteDialogComponent {

    statuscustom: StatusCustom;

    constructor(
        private statuscustomService: StatusCustomService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: string) {
        this.statuscustomService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'statuscustomsListModification',
                content: 'Deleted an status'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-status-custom-delete-popup',
    template: ''
})
export class StatusCustomDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private statuscustomPopupService: StatusCustomPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.statuscustomPopupService
                .open(StatusCustomDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
