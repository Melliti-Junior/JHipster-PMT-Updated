import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {JhiEventManager} from 'ng-jhipster';

import {ProjectCustom} from './project-custom.model';
import {ProjectCustomPopupService} from './project-custom-popup.service';
import {ProjectCustomService} from './project-custom.service';

@Component({
    selector: 'jhi-project-custom-delete-dialog',
    templateUrl: './project-custom-delete-dialog.component.html'
})
export class ProjectCustomDeleteDialogComponent {

    projectcustom: ProjectCustom;

    constructor(
        private projectcustomService: ProjectCustomService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: string) {
        this.projectcustomService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'projectcustomListModification',
                content: 'Deleted an projectcustom'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-project-custom-delete-popup',
    template: ''
})
export class ProjectCustomDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private projectcustomPopupService: ProjectCustomPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.projectcustomPopupService
                .open(ProjectCustomDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
