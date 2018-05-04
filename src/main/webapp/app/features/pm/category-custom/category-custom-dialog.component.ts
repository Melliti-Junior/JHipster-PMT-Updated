import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { CategoryCustom } from './category-custom.model';
import { CategoryCustomPopupService } from './category-custom-popup.service';
import { CategoryCustomService } from './category-custom.service';

@Component({
    selector: 'jhi-category-custom-dialog',
    templateUrl: './category-custom-dialog.component.html'
})
export class CategoryCustomDialogComponent implements OnInit {

    categorycustom: CategoryCustom;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private categorycustomService: CategoryCustomService,
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
        if (this.categorycustom.id !== undefined) {
            this.subscribeToSaveResponse(
                this.categorycustomService.update(this.categorycustom));
        } else {
            this.subscribeToSaveResponse(
                this.categorycustomService.create(this.categorycustom));
        }
    }

    private subscribeToSaveResponse(result: Observable<CategoryCustom>) {
        result.subscribe((res: CategoryCustom) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: CategoryCustom) {
        this.eventManager.broadcast({ name: 'categorycustomsListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-category-custom-popup',
    template: ''
})
export class CategoryCustomPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private categorycustomPopupService: CategoryCustomPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.categorycustomPopupService
                    .open(CategoryCustomDialogComponent as Component, params['id']);
            } else {
                this.categorycustomPopupService
                    .open(CategoryCustomDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
