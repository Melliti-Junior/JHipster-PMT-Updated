import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IssuePriority } from './issue-priority.model';
import { IssuePriorityPopupService } from './issue-priority-popup.service';
import { IssuePriorityService } from './issue-priority.service';

@Component({
    selector: 'jhi-issue-priority-delete-dialog',
    templateUrl: './issue-priority-delete-dialog.component.html'
})
export class IssuePriorityDeleteDialogComponent {

    issuePriority: IssuePriority;

    constructor(
        private issuePriorityService: IssuePriorityService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: string) {
        this.issuePriorityService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'issuePriorityListModification',
                content: 'Deleted an issuePriority'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-issue-priority-delete-popup',
    template: ''
})
export class IssuePriorityDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private issuePriorityPopupService: IssuePriorityPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.issuePriorityPopupService
                .open(IssuePriorityDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
