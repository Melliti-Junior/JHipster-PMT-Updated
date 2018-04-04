import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Version } from './version.model';
import { VersionPopupService } from './version-popup.service';
import { VersionService } from './version.service';

@Component({
    selector: 'jhi-version-dialog',
    templateUrl: './version-dialog.component.html'
})
export class VersionDialogComponent implements OnInit {

    version: Version;
    isSaving: boolean;
    startDateDp: any;
    releaseDateDp: any;

    constructor(
        public activeModal: NgbActiveModal,
        private versionService: VersionService,
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
        if (this.version.id !== undefined) {
            this.subscribeToSaveResponse(
                this.versionService.update(this.version));
        } else {
            this.subscribeToSaveResponse(
                this.versionService.create(this.version));
        }
    }

    private subscribeToSaveResponse(result: Observable<Version>) {
        result.subscribe((res: Version) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: Version) {
        this.eventManager.broadcast({ name: 'versionListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-version-popup',
    template: ''
})
export class VersionPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private versionPopupService: VersionPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.versionPopupService
                    .open(VersionDialogComponent as Component, params['id']);
            } else {
                this.versionPopupService
                    .open(VersionDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
