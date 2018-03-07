import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Issue } from './issue.model';
import { IssuePopupService } from './issue-popup.service';
import { IssueService } from './issue.service';

@Component({
    selector: 'jhi-issue-dialog',
    templateUrl: './issue-dialog.component.html'
})
export class IssueDialogComponent implements OnInit {

    issue: Issue;
    isSaving: boolean;
    createdDateDp: any;
    dueDateDp: any;

    constructor(
        public activeModal: NgbActiveModal,
        private issueService: IssueService,
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
        if (this.issue.id !== undefined) {
            this.subscribeToSaveResponse(
                this.issueService.update(this.issue));
        } else {
            this.subscribeToSaveResponse(
                this.issueService.create(this.issue));
        }
    }

    private subscribeToSaveResponse(result: Observable<Issue>) {
        result.subscribe((res: Issue) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: Issue) {
        this.eventManager.broadcast({ name: 'issueListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-issue-popup',
    template: ''
})
export class IssuePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private issuePopupService: IssuePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.issuePopupService
                    .open(IssueDialogComponent as Component, params['id']);
            } else {
                this.issuePopupService
                    .open(IssueDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
