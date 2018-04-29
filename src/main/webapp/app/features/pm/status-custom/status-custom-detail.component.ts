import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { StatusCustom } from './status-custom.model';
import { StatusCustomService } from './status-custom.service';

@Component({
    selector: 'jhi-status-custom-detail',
    templateUrl: './status-custom-detail.component.html'
})
export class StatusCustomDetailComponent implements OnInit, OnDestroy {

    statuscustom: StatusCustom;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private statuscustomService: StatusCustomService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInStatuses();
    }

    load(id) {
        this.statuscustomService.find(id).subscribe((statuscustom) => {
            this.statuscustom = statuscustom;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInStatuses() {
        this.eventSubscriber = this.eventManager.subscribe(
            'statuscustomsListModification',
            (response) => this.load(this.statuscustom.id)
        );
    }
}
