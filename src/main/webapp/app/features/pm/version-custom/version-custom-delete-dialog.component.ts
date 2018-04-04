import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { VersionCustom } from './version-custom.model';
import { VersionCustomPopupService } from './version-custom-popup.service';
import { VersionCustomService } from './version-custom.service';

@Component({
    selector: 'jhi-version-custom-delete-dialog',
    templateUrl: './version-custom-delete-dialog.component.html'
})
export class VersionCustomDeleteDialogComponent {

    versioncustom: VersionCustom;

    constructor(
        private versioncustomService: VersionCustomService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: string) {
        this.versioncustomService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'versioncustomsListModification',
                content: 'Deleted an version'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-version-custom-delete-popup',
    template: ''
})
export class VersionCustomDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private versioncustomPopupService: VersionCustomPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.versioncustomPopupService
                .open(VersionCustomDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
