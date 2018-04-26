import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ColumnCustom } from './column-custom.model';
import { ColumnCustomPopupService } from './column-custom-popup.service';
import { ColumnCustomService } from './column-custom.service';
import {Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {BoardCustom} from '../board-custom/board-custom.model';

@Component({
    selector: 'jhi-column-custom-start-dialog',
    templateUrl: './column-custom-start-dialog.component.html'
})
export class ColumnCustomStartDialogComponent implements OnInit {

    columncustom: ColumnCustom;
    columncustoms: ColumnCustom[];
    isSaving: boolean;

    constructor(
        private columncustomService: ColumnCustomService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager,
        private columncustomSce: ColumnCustomService,
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    ngOnInit() {
        this.isSaving = false;
        this.columncustomService.getColumnCustoms()
            .then((columns) => this.columncustoms = columns );
        this.verifyDates(this.columncustom);
    }

    private subscribeToSaveResponse(result: Observable<BoardCustom>) {
        result.subscribe((res: BoardCustom) =>
            this.onSaveSuccess(res));
    }

    private onSaveSuccess(result: BoardCustom) {
        this.eventManager.broadcast({ name: 'columncustomsListModification', content: 'OK'});
    }
    verifyDates(column) {
        this.columncustomService.find(column.id).subscribe((columncustom) => {
        });
    }
}

@Component({
    selector: 'jhi-column-custom-start-popup',
    template: ''
})
export class ColumnCustomStartPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private columncustomService: ColumnCustomService,
        private columncustomPopupService: ColumnCustomPopupService
    ) {}

    ngOnInit() {
        /*
        this.routeSub = this.route.params.subscribe((params) => {
            this.columncustomPopupService
                .open(ColumnCustomStartDialogComponent as Component, params['id']);
        });
*/
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.columncustomPopupService
                    .open(ColumnCustomStartDialogComponent as Component, params['id']);
            } else {
                this.columncustomPopupService
                    .open(ColumnCustomStartDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
