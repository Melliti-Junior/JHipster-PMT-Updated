import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {JhiEventManager} from 'ng-jhipster';

import {WorkflowCustom} from './workflow-custom.model';
import {WorkflowCustomPopupService} from './workflow-custom-popup.service';
import {WorkflowCustomService} from './workflow-custom.service';

@Component({
    selector: 'jhi-workflow-custom-delete-dialog',
    templateUrl: './workflow-custom-delete-dialog.component.html'
})
export class WorkflowCustomDeleteDialogComponent {

    workflowcustom: WorkflowCustom;

    constructor(
        private workflowcustomService: WorkflowCustomService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: string) {
        this.workflowcustomService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'workflowcustomsListModification',
                content: 'Deleted an workflow'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-workflow-custom-delete-popup',
    template: ''
})
export class WorkflowCustomDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private workflowcustomPopupService: WorkflowCustomPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.workflowcustomPopupService
                .open(WorkflowCustomDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
