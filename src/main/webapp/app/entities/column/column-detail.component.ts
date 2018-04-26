import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { Column } from './column.model';
import { ColumnService } from './column.service';

@Component({
    selector: 'jhi-column-detail',
    templateUrl: './column-detail.component.html'
})
export class ColumnDetailComponent implements OnInit, OnDestroy {

    column: Column;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private columnService: ColumnService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInColumns();
    }

    load(id) {
        this.columnService.find(id).subscribe((column) => {
            this.column = column;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInColumns() {
        this.eventSubscriber = this.eventManager.subscribe(
            'columnListModification',
            (response) => this.load(this.column.id)
        );
    }
}
