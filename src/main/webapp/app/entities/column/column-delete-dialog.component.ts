import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Column } from './column.model';
import { ColumnPopupService } from './column-popup.service';
import { ColumnService } from './column.service';

@Component({
    selector: 'jhi-column-delete-dialog',
    templateUrl: './column-delete-dialog.component.html'
})
export class ColumnDeleteDialogComponent {

    column: Column;

    constructor(
        private columnService: ColumnService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: string) {
        this.columnService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'columnListModification',
                content: 'Deleted an column'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-column-delete-popup',
    template: ''
})
export class ColumnDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private columnPopupService: ColumnPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.columnPopupService
                .open(ColumnDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
