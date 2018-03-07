import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Epic } from './epic.model';
import { EpicPopupService } from './epic-popup.service';
import { EpicService } from './epic.service';

@Component({
    selector: 'jhi-epic-delete-dialog',
    templateUrl: './epic-delete-dialog.component.html'
})
export class EpicDeleteDialogComponent {

    epic: Epic;

    constructor(
        private epicService: EpicService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: string) {
        this.epicService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'epicListModification',
                content: 'Deleted an epic'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-epic-delete-popup',
    template: ''
})
export class EpicDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private epicPopupService: EpicPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.epicPopupService
                .open(EpicDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
