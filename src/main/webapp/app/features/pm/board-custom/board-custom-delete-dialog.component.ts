import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { BoardCustom } from './board-custom.model';
import { BoardCustomPopupService } from './board-custom-popup.service';
import { BoardCustomService } from './board-custom.service';

@Component({
    selector: 'jhi-board-custom-delete-dialog',
    templateUrl: './board-custom-delete-dialog.component.html'
})
export class BoardCustomDeleteDialogComponent {

    boardcustom: BoardCustom;

    constructor(
        private boardcustomService: BoardCustomService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: string) {
        this.boardcustomService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'boardcustomsListModification',
                content: 'Deleted an board'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-board-custom-delete-popup',
    template: ''
})
export class BoardCustomDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private boardcustomPopupService: BoardCustomPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.boardcustomPopupService
                .open(BoardCustomDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
