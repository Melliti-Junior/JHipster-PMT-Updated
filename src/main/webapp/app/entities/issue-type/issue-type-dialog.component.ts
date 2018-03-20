import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IssueType } from './issue-type.model';
import { IssueTypePopupService } from './issue-type-popup.service';
import { IssueTypeService } from './issue-type.service';

@Component({
    selector: 'jhi-issue-type-dialog',
    templateUrl: './issue-type-dialog.component.html'
})
export class IssueTypeDialogComponent implements OnInit {

    issueType: IssueType;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private issueTypeService: IssueTypeService,
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
        if (this.issueType.id !== undefined) {
            this.subscribeToSaveResponse(
                this.issueTypeService.update(this.issueType));
        } else {
            this.subscribeToSaveResponse(
                this.issueTypeService.create(this.issueType));
        }
    }

    fileUpload() {
        // tslint:disable-next-line:prefer-const
        let val = <HTMLInputElement> document.getElementById('field_icon');
        val.addEventListener('change', function(event){
            // tslint:disable-next-line:prefer-const
            let file = this.files[0];
            val.src = URL.createObjectURL(file);
            // This code is only for demo ...
            console.log('name : ' + file.webkitRelativePath);
            console.log('size : ' + file.size);
            console.log('type : ' + file.type);
        }, false);
    }

    private subscribeToSaveResponse(result: Observable<IssueType>) {
        result.subscribe((res: IssueType) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: IssueType) {
        this.eventManager.broadcast({ name: 'issueTypeListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-issue-type-popup',
    template: ''
})
export class IssueTypePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private issueTypePopupService: IssueTypePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.issueTypePopupService
                    .open(IssueTypeDialogComponent as Component, params['id']);
            } else {
                this.issueTypePopupService
                    .open(IssueTypeDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
