import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IssueCustom } from './issue-custom.model';
import { IssueCustomPopupService } from './issue-custom-popup.service';
import { IssueCustomService } from './issue-custom.service';

@Component({
    selector: 'jhi-issue-custom-delete-dialog',
    templateUrl: './issue-custom-delete-dialog.component.html'
})
export class IssueCustomDeleteDialogComponent {

    issuecustom: IssueCustom;

    constructor(
        private issuecustomService: IssueCustomService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: string) {
        this.issuecustomService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'issuecustomsListModification',
                content: 'Deleted an issue'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-issue-custom-delete-popup',
    template: ''
})
export class IssueCustomDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private issuecustomPopupService: IssueCustomPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.issuecustomPopupService
                .open(IssueCustomDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
