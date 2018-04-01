import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Board } from './board.model';
import { BoardPopupService } from './board-popup.service';
import { BoardService } from './board.service';

@Component({
    selector: 'jhi-board-dialog',
    templateUrl: './board-dialog.component.html'
})
export class BoardDialogComponent implements OnInit {

    board: Board;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private boardService: BoardService,
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
        if (this.board.id !== undefined) {
            this.subscribeToSaveResponse(
                this.boardService.update(this.board));
        } else {
            this.subscribeToSaveResponse(
                this.boardService.create(this.board));
        }
    }

    private subscribeToSaveResponse(result: Observable<Board>) {
        result.subscribe((res: Board) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: Board) {
        this.eventManager.broadcast({ name: 'boardListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-board-popup',
    template: ''
})
export class BoardPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private boardPopupService: BoardPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.boardPopupService
                    .open(BoardDialogComponent as Component, params['id']);
            } else {
                this.boardPopupService
                    .open(BoardDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
