import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IssueType } from './issue-type.model';
import { IssueTypePopupService } from './issue-type-popup.service';
import { IssueTypeService } from './issue-type.service';

@Component({
    selector: 'jhi-issue-type-delete-dialog',
    templateUrl: './issue-type-delete-dialog.component.html'
})
export class IssueTypeDeleteDialogComponent {

    issueType: IssueType;

    constructor(
        private issueTypeService: IssueTypeService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: string) {
        this.issueTypeService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'issueTypeListModification',
                content: 'Deleted an issueType'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-issue-type-delete-popup',
    template: ''
})
export class IssueTypeDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private issueTypePopupService: IssueTypePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.issueTypePopupService
                .open(IssueTypeDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
