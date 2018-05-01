import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { Transition } from './transition.model';
import { TransitionService } from './transition.service';

@Component({
    selector: 'jhi-transition-detail',
    templateUrl: './transition-detail.component.html'
})
export class TransitionDetailComponent implements OnInit, OnDestroy {

    transition: Transition;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private transitionService: TransitionService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInTransitions();
    }

    load(id) {
        this.transitionService.find(id).subscribe((transition) => {
            this.transition = transition;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInTransitions() {
        this.eventSubscriber = this.eventManager.subscribe(
            'transitionListModification',
            (response) => this.load(this.transition.id)
        );
    }
}
