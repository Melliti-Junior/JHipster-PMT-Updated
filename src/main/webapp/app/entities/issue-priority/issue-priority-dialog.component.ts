import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IssuePriority } from './issue-priority.model';
import { IssuePriorityPopupService } from './issue-priority-popup.service';
import { IssuePriorityService } from './issue-priority.service';

@Component({
    selector: 'jhi-issue-priority-dialog',
    templateUrl: './issue-priority-dialog.component.html'
})
export class IssuePriorityDialogComponent implements OnInit {

    issuePriority: IssuePriority;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private issuePriorityService: IssuePriorityService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.issuePriority.id !== undefined) {
            this.subscribeToSaveResponse(
                this.issuePriorityService.update(this.issuePriority));
        } else {
            this.subscribeToSaveResponse(
                this.issuePriorityService.create(this.issuePriority));
        }
    }

    private subscribeToSaveResponse(result: Observable<IssuePriority>) {
        result.subscribe((res: IssuePriority) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: IssuePriority) {
        this.eventManager.broadcast({ name: 'issuePriorityListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-issue-priority-popup',
    template: ''
})
export class IssuePriorityPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private issuePriorityPopupService: IssuePriorityPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.issuePriorityPopupService
                    .open(IssuePriorityDialogComponent as Component, params['id']);
            } else {
                this.issuePriorityPopupService
                    .open(IssuePriorityDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
