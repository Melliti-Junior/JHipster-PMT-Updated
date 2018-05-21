import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IssueCustom } from './issue-custom.model';
import { IssueCustomPopupService } from './issue-custom-popup.service';
import { IssueCustomService } from './issue-custom.service';
import {ResolutionService} from '../../../entities/resolution';
import {ResolutionCustom} from '../resolution-custom';
import {Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {StatusCustom, StatusCustomService} from '../status-custom';

@Component({
    selector: 'jhi-issue-custom-resolve-dialog',
    templateUrl: './issue-custom-resolve-dialog.component.html'
})
export class IssueCustomResolveDialogComponent implements OnInit {

    issuecustom: IssueCustom;
    resolutions: ResolutionCustom[];
    statuses: StatusCustom[];
    resolutionname: string;

    isSaving: boolean;

    constructor(
        private issuecustomService: IssueCustomService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager,
        private resolutionSce: ResolutionService,
        private statusSce: StatusCustomService,
    ) {
    }

    ngOnInit() {
        this.resolutionSce.getResolutions()
            .then((resolutions) => this.resolutions = resolutions );
        this.statusSce.getStatusCustoms()
            .then((statuses) => this.statuses = statuses);
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    findResolution() {
        let index = 0;
        let found = false;
        while (index < this.resolutions.length && found === false)  {
            if ((this.resolutions[index]).name === this.resolutionname) {
                found = true;
                this.issuecustom.resolution = this.resolutions[index];
            } else {
                index = index + 1;
            }
        }
        console.log('aff' + this.issuecustom.resolution.name);
    }

    private subscribeToSaveResponse(result: Observable<IssueCustom>) {
        result.subscribe((res: IssueCustom) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: IssueCustom) {
        this.eventManager.broadcast({ name: 'issuecustomsListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    confirmChanges() {
        for (let status of this.statuses) {
            if (status.name.toLowerCase() === 'closed') {
                this.issuecustom.status = status;
            }
        }

        this.subscribeToSaveResponse(
            this.issuecustomService.update(this.issuecustom));
    }
}

@Component({
    selector: 'jhi-issue-custom-resolve-popup',
    template: ''
})
export class IssueCustomResolvePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private issuecustomPopupService: IssueCustomPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.issuecustomPopupService
                .open(IssueCustomResolveDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
