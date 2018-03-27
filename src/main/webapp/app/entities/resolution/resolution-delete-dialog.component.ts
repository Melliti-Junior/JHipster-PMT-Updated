import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Resolution } from './resolution.model';
import { ResolutionPopupService } from './resolution-popup.service';
import { ResolutionService } from './resolution.service';

@Component({
    selector: 'jhi-resolution-delete-dialog',
    templateUrl: './resolution-delete-dialog.component.html'
})
export class ResolutionDeleteDialogComponent {

    resolution: Resolution;

    constructor(
        private resolutionService: ResolutionService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: string) {
        this.resolutionService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'resolutionListModification',
                content: 'Deleted an resolution'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-resolution-delete-popup',
    template: ''
})
export class ResolutionDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private resolutionPopupService: ResolutionPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.resolutionPopupService
                .open(ResolutionDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
