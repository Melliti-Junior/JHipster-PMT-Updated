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

@Component({
    selector: 'jhi-sprint-custom-start-dialog',
    templateUrl: './sprint-custom-start-dialog.component.html'
})
export class SprintCustomStartDialogComponent implements OnInit {

    sprintcustom: SprintCustom;
    sprintcustoms: SprintCustom[];

    constructor(
        private sprintcustomService: SprintCustomService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager,
        private sprintcustomSce: SprintCustomService,
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    ngOnInit() {
        this.sprintcustomService.getSprintCustoms()
            .then((sprints) => this.sprintcustoms = sprints );
    }

    private subscribeToSaveResponse(result: Observable<BoardCustom>) {
        result.subscribe((res: BoardCustom) =>
            this.onSaveSuccess(res));
    }

    private onSaveSuccess(result: BoardCustom) {
        this.eventManager.broadcast({ name: 'sprintcustomsListModification', content: 'OK'});
    }
    confirmStart(sprint: SprintCustom) {
        console.log(sprint.isActive);

        sprint.isActive = true;

        for (let sp of this.sprintcustoms) {
            if (sp.board.name === sprint.board.name) {
                if (sp.id !== sprint.id) {
                    sp.isActive = false;
                    console.log('name : ' + sp.name)
                    // Make the other sprints not active
                    if (sp.id !== undefined) {
                        this.subscribeToSaveResponse(
                            this.sprintcustomSce.update(sp));
                    }
                }
            }
        }

        // Make the chosen sprint active
        this.sprintcustomService.update(sprint).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'sprintcustomsListModification',
                content: 'Started an sprint'
            });
            this.activeModal.dismiss(true);
        });
        console.log(sprint.isActive);
    }
}

@Component({
    selector: 'jhi-sprint-custom-start-popup',
    template: ''
})
export class SprintCustomStartPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private sprintcustomService: SprintCustomService,
        private sprintcustomPopupService: SprintCustomPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.sprintcustomPopupService
                .open(SprintCustomStartDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
