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
import {Principal, User, UserService} from "../../../shared";

@Component({
    selector: 'jhi-issue-custom-assign-dialog',
    templateUrl: './issue-custom-assign-dialog.component.html'
})
export class IssueCustomAssignDialogComponent implements OnInit {

    issuecustom: IssueCustom;
    users: User[];
    username: string;

    isSaving: boolean;

    currentAccount: any;

    constructor(
        private issuecustomService: IssueCustomService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager,
        private userSce: UserService,
        private principal: Principal,
    ) {
    }

    ngOnInit() {
        this.userSce.getUsers()
            .then((users) => this.users = users );
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    findUser() {
        let index = 0;
        let found = false;
        while (index < this.users.length && found === false)  {
            if ((this.users[index]).login === this.username) {
                found = true;
                this.issuecustom.assignee = this.users[index];
            } else {
                index = index + 1;
            }
        }
        console.log('aff' + this.issuecustom.assignee.login);
    }

    assignToMe() {
        let index = 0;
        let found = false;
        while (index < this.users.length && found === false)  {
            if ((this.users[index]).login.toLowerCase() === this.currentAccount.login.toLowerCase()) {
                found = true;
                this.issuecustom.assignee = this.users[index];
            } else {
                index = index + 1;
            }
        }
        console.log('aff' + this.issuecustom.assignee.login);

        this.subscribeToSaveResponse(
            this.issuecustomService.update(this.issuecustom));
    }

    private subscribeToSaveResponse(result: Observable<IssueCustom>) {
        result.subscribe((res: IssueCustom) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: IssueCustom) {
        this.eventManager.broadcast({ name: 'issuecustomsDetailsModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    confirmChanges() {
        this.subscribeToSaveResponse(
            this.issuecustomService.update(this.issuecustom));
    }
}

@Component({
    selector: 'jhi-issue-custom-resolve-popup',
    template: ''
})
export class IssueCustomAssignPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private issuecustomPopupService: IssueCustomPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.issuecustomPopupService
                .open(IssueCustomAssignDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
