import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { SprintCustom } from './sprint-custom.model';
import { SprintCustomPopupService } from './sprint-custom-popup.service';
import { SprintCustomService } from './sprint-custom.service';

@Component({
    selector: 'jhi-sprint-custom-delete-dialog',
    templateUrl: './sprint-custom-delete-dialog.component.html'
})
export class SprintCustomDeleteDialogComponent {

    sprintcustom: SprintCustom;

    constructor(
        private sprintcustomService: SprintCustomService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: string) {
        this.sprintcustomService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'sprintcustomsListModification',
                content: 'Deleted an sprint'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-sprint-custom-delete-popup',
    template: ''
})
export class SprintCustomDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private sprintcustomPopupService: SprintCustomPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.sprintcustomPopupService
                .open(SprintCustomDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
