import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Response} from '@angular/http';

import {Observable} from 'rxjs/Observable';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {JhiEventManager} from 'ng-jhipster';

import {StatusCustom} from './status-custom.model';
import {StatusCustomPopupService} from './status-custom-popup.service';
import {StatusCustomService} from './status-custom.service';
import {CategoryCustom, CategoryCustomService} from '../category-custom';

@Component({
    selector: 'jhi-status-custom-dialog',
    templateUrl: './status-custom-dialog.component.html'
})
export class StatusCustomDialogComponent implements OnInit {

    statuscustom: StatusCustom;
    isSaving: boolean;

    categorycustoms: CategoryCustom[];
    categoryName: string;

    constructor(
        public activeModal: NgbActiveModal,
        private statuscustomService: StatusCustomService,
        private categorySce: CategoryCustomService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.loadAttributes();
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.statuscustom.id !== undefined) {
            this.subscribeToSaveResponse(
                this.statuscustomService.update(this.statuscustom));
        } else {
            this.subscribeToSaveResponse(
                this.statuscustomService.create(this.statuscustom));
        }
    }

    private loadAttributes() {
        this.categorySce.getCategoryCustoms()
            .then((categorycustoms) => this.categorycustoms = categorycustoms );
    }

    findCategory() {
        let index = 0;
        let found = false;

        while (index < this.categorycustoms.length && found === false)  {
            if ((this.categorycustoms[index]).name === this.categoryName) {
                found = true;
                this.statuscustom.category = this.categorycustoms[index];
            } else {
                index = index + 1;
            }
        }
        console.log('aff' + this.statuscustom.category.name);
    }

    private subscribeToSaveResponse(result: Observable<StatusCustom>) {
        result.subscribe((res: StatusCustom) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: StatusCustom) {
        this.eventManager.broadcast({ name: 'statuscustomsListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-status-custom-popup',
    template: ''
})
export class StatusCustomPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private statuscustomPopupService: StatusCustomPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.statuscustomPopupService
                    .open(StatusCustomDialogComponent as Component, params['id']);
            } else {
                this.statuscustomPopupService
                    .open(StatusCustomDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
