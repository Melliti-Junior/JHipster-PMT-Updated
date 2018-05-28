import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { SprintCustom } from './sprint-custom.model';
import { SprintCustomPopupService } from './sprint-custom-popup.service';
import { SprintCustomService } from './sprint-custom.service';
import {Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {BoardCustom} from '../board-custom/board-custom.model';
import {Router} from '@angular/router';
import {IssueCustomService} from '../issue-custom/issue-custom.service';
import {IssueCustom} from '../issue-custom/issue-custom.model';

@Component({
    selector: 'jhi-sprint-custom-complete-dialog',
    templateUrl: './sprint-custom-complete-dialog.component.html'
})
export class SprintCustomCompleteDialogComponent implements OnInit {

    sprintcustom: SprintCustom;
    sprintcustoms: SprintCustom[];
    issuecustoms: IssueCustom[];
    relatedIssues: IssueCustom[];
    isSaving: boolean;

    constructor(
        private sprintcustomService: SprintCustomService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager,
        private sprintcustomSce: SprintCustomService,
        private issuecustomSce: IssueCustomService,
        private router: Router,
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    ngOnInit() {
        this.isSaving = false;
        this.sprintcustomService.getSprintCustoms()
            .then((sprints) => this.sprintcustoms = sprints );
        this.issuecustomSce.getIssueCustoms()
            .then((issues)=> this.issuecustoms = issues);
        this.verifyDates(this.sprintcustom);
    }

    private subscribeToSaveResponse(result: Observable<BoardCustom>) {
        result.subscribe((res: BoardCustom) =>
            this.onSaveSuccess(res));
    }

    private onSaveSuccess(result: BoardCustom) {
        // this.eventManager.broadcast({ name: 'sprintcustomsListModification', content: 'OK'});
        this.eventManager.broadcast({ name: 'boardcustomsAgileModification', content: 'OK'});
    }

    verifyDates(sprint) {
        this.sprintcustomService.find(sprint.id).subscribe((sprintcustom) => {
            if (sprint.startDate) {
                sprint.startDate = {
                    year: sprintcustom.startDate.getFullYear(),
                    month: sprintcustom.startDate.getMonth() + 1,
                    day: sprintcustom.startDate.getDate()
                };
            }
            if (sprint.endDate) {
                sprint.endDate = {
                    year: sprintcustom.endDate.getFullYear(),
                    month: sprintcustom.endDate.getMonth() + 1,
                    day: sprintcustom.endDate.getDate()
                };
            }
        });
    }

    verifyIssueDates(issue) {
        this.issuecustomSce.find(issue.id).subscribe((issuecustom) => {
            if (issue.createdDate) {
                issue.createdDate = {
                    year: issuecustom.createdDate.getFullYear(),
                    month: issuecustom.createdDate.getMonth() + 1,
                    day: issuecustom.createdDate.getDate()
                };
            }
            if (issue.updatedDate) {
                issue.updatedDate = {
                    year: issuecustom.updatedDate.getFullYear(),
                    month: issuecustom.updatedDate.getMonth() + 1,
                    day: issuecustom.updatedDate.getDate()
                };
            }
            if (issue.dueDate) {
                issue.dueDate = {
                    year: issuecustom.dueDate.getFullYear(),
                    month: issuecustom.dueDate.getMonth() + 1,
                    day: issuecustom.dueDate.getDate()
                };
            }
        });
    }

    private subscribeToSaveIssuesResponse(result: Observable<IssueCustom>) {
        result.subscribe((res: IssueCustom) =>
            this.onSaveIssuesSuccess(res), (res: Response) => this.onSaveIssuesError());
    }

    private onSaveIssuesSuccess(result: IssueCustom) {
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveIssuesError() {
        this.isSaving = false;
    }

    confirmComplete(sprint: SprintCustom) {
        console.log(sprint.isActive);

        this.verifyDates(sprint);

        setTimeout(() => {
            sprint.isActive = false;

            for (let sp of this.sprintcustoms) {
                this.verifyDates(sp);

                setTimeout(() => {
                    if (sp.board.name === sprint.board.name) {

                        for (let issue of this.issuecustoms) {
                            if (issue.sprint && issue.sprint.id === sp.id) {
                                this.verifyIssueDates(issue);

                                if (issue.status.category.code.toLocaleUpperCase() !== 'DONE') {
                                    issue.sprint = null;
                                }

                                setTimeout(() => {
                                    this.subscribeToSaveIssuesResponse(
                                        this.issuecustomSce.update(issue));
                                }, 1000);
                            }
                        }

                        if (sp.id !== sprint.id) {
                            sp.isActive = false;
                            // Make the other sprints not active
                            console.log('I am here ' + sp.code)

                            if (sp.id !== undefined) {
                                this.subscribeToSaveResponse(
                                    this.sprintcustomSce.update(sp));
                            }
                        }
                    }
                }, 1000);
            }

            // Make the chosen sprint active
            this.sprintcustomService.update(sprint).subscribe((response) => {
                this.eventManager.broadcast({
                    name: 'sprintcustomsListModification',
                    content: 'Started an sprint'
                });
                //
                // location.reload();
                this.router.navigate(['/sprintcustoms']);

                this.activeModal.dismiss(true);
            });
            console.log(sprint.isActive);
            this.eventManager.broadcast({ name: 'boardcustomsListModification', content: 'OK'});

            this.activeModal.dismiss('completed');

        }, 1000);
    }
}

@Component({
    selector: 'jhi-sprint-custom-complete-popup',
    template: ''
})
export class SprintCustomCompletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private sprintcustomService: SprintCustomService,
        private sprintcustomPopupService: SprintCustomPopupService
    ) {}

    ngOnInit() {
        /*
        this.routeSub = this.route.params.subscribe((params) => {
            this.sprintcustomPopupService
                .open(SprintCustomCompleteDialogComponent as Component, params['id']);
        });
*/
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.sprintcustomPopupService
                    .open(SprintCustomCompleteDialogComponent as Component, params['id']);
            } else {
                this.sprintcustomPopupService
                    .open(SprintCustomCompleteDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
