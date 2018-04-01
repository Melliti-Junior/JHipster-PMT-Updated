import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { Board } from './board.model';
import { BoardService } from './board.service';

@Component({
    selector: 'jhi-board-detail',
    templateUrl: './board-detail.component.html'
})
export class BoardDetailComponent implements OnInit, OnDestroy {

    board: Board;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private boardService: BoardService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInBoards();
    }

    load(id) {
        this.boardService.find(id).subscribe((board) => {
            this.board = board;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInBoards() {
        this.eventSubscriber = this.eventManager.subscribe(
            'boardListModification',
            (response) => this.load(this.board.id)
        );
    }
}
