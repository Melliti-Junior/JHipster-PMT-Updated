import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { Sprint } from './sprint.model';
import { SprintService } from './sprint.service';

@Component({
    selector: 'jhi-sprint-detail',
    templateUrl: './sprint-detail.component.html'
})
export class SprintDetailComponent implements OnInit, OnDestroy {

    sprint: Sprint;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private sprintService: SprintService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInSprints();
    }

    load(id) {
        this.sprintService.find(id).subscribe((sprint) => {
            this.sprint = sprint;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInSprints() {
        this.eventSubscriber = this.eventManager.subscribe(
            'sprintListModification',
            (response) => this.load(this.sprint.id)
        );
    }
}
