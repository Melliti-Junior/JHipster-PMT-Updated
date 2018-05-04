import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { CategoryCustom } from './category-custom.model';
import { CategoryCustomPopupService } from './category-custom-popup.service';
import {CategoryCustomService} from './category-custom.service';

@Component({
    selector: 'jhi-category-custom-delete-dialog',
    templateUrl: './category-custom-delete-dialog.component.html'
})
export class CategoryCustomDeleteDialogComponent {

    categorycustom: CategoryCustom;

    constructor(
        private categorycustomService: CategoryCustomService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: string) {
        this.categorycustomService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'categorycustomsListModification',
                content: 'Deleted an category'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-category-custom-delete-popup',
    template: ''
})
export class CategoryCustomDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private categorycustomPopupService: CategoryCustomPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.categorycustomPopupService
                .open(CategoryCustomDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
