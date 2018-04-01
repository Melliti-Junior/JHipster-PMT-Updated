import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Board } from './board.model';
import { BoardPopupService } from './board-popup.service';
import { BoardService } from './board.service';

@Component({
    selector: 'jhi-board-delete-dialog',
    templateUrl: './board-delete-dialog.component.html'
})
export class BoardDeleteDialogComponent {

    board: Board;

    constructor(
        private boardService: BoardService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: string) {
        this.boardService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'boardListModification',
                content: 'Deleted an board'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-board-delete-popup',
    template: ''
})
export class BoardDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private boardPopupService: BoardPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.boardPopupService
                .open(BoardDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
