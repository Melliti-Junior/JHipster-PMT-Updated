import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {JhiEventManager} from 'ng-jhipster';

import {ResolutionCustom} from './resolution-custom.model';
import {ResolutionCustomPopupService} from './resolution-custom-popup.service';
import {ResolutionCustomService} from './resolution-custom.service';

@Component({
    selector: 'jhi-resolution-custom-delete-dialog',
    templateUrl: './resolution-custom-delete-dialog.component.html'
})
export class ResolutionCustomDeleteDialogComponent {

    resolutioncustom: ResolutionCustom;

    constructor(
        private resolutioncustomService: ResolutionCustomService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: string) {
        this.resolutioncustomService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'resolutioncustomsListModification',
                content: 'Deleted an resolution'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-resolution-custom-delete-popup',
    template: ''
})
export class ResolutionCustomDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private resolutioncustomPopupService: ResolutionCustomPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.resolutioncustomPopupService
                .open(ResolutionCustomDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
