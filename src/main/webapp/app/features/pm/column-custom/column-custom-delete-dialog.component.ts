import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {JhiEventManager} from 'ng-jhipster';

import {ColumnCustom} from './column-custom.model';
import {ColumnCustomPopupService} from './column-custom-popup.service';
import {ColumnCustomService} from './column-custom.service';

@Component({
    selector: 'jhi-column-custom-delete-dialog',
    templateUrl: './column-custom-delete-dialog.component.html'
})
export class ColumnCustomDeleteDialogComponent {

    columncustom: ColumnCustom;

    constructor(
        private columncustomService: ColumnCustomService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: string) {
        this.columncustomService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'columncustomsListModification',
                content: 'Deleted an column'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-column-custom-delete-popup',
    template: ''
})
export class ColumnCustomDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private columncustomPopupService: ColumnCustomPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.columncustomPopupService
                .open(ColumnCustomDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
