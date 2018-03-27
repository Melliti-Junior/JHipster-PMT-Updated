import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { Resolution } from './resolution.model';
import { ResolutionService } from './resolution.service';

@Component({
    selector: 'jhi-resolution-detail',
    templateUrl: './resolution-detail.component.html'
})
export class ResolutionDetailComponent implements OnInit, OnDestroy {

    resolution: Resolution;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private resolutionService: ResolutionService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInResolutions();
    }

    load(id) {
        this.resolutionService.find(id).subscribe((resolution) => {
            this.resolution = resolution;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInResolutions() {
        this.eventSubscriber = this.eventManager.subscribe(
            'resolutionListModification',
            (response) => this.load(this.resolution.id)
        );
    }
}
