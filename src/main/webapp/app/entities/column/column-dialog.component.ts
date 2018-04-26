import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Column } from './column.model';
import { ColumnPopupService } from './column-popup.service';
import { ColumnService } from './column.service';

@Component({
    selector: 'jhi-column-dialog',
    templateUrl: './column-dialog.component.html'
})
export class ColumnDialogComponent implements OnInit {

    column: Column;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private columnService: ColumnService,
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
        if (this.column.id !== undefined) {
            this.subscribeToSaveResponse(
                this.columnService.update(this.column));
        } else {
            this.subscribeToSaveResponse(
                this.columnService.create(this.column));
        }
    }

    private subscribeToSaveResponse(result: Observable<Column>) {
        result.subscribe((res: Column) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: Column) {
        this.eventManager.broadcast({ name: 'columnListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-column-popup',
    template: ''
})
export class ColumnPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private columnPopupService: ColumnPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.columnPopupService
                    .open(ColumnDialogComponent as Component, params['id']);
            } else {
                this.columnPopupService
                    .open(ColumnDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
