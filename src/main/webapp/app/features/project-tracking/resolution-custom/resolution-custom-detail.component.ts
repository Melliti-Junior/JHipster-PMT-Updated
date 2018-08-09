import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {JhiEventManager} from 'ng-jhipster';

import {ResolutionCustom} from './resolution-custom.model';
import {ResolutionCustomService} from './resolution-custom.service';

@Component({
    selector: 'jhi-resolution-custom-detail',
    templateUrl: './resolution-custom-detail.component.html'
})
export class ResolutionCustomDetailComponent implements OnInit, OnDestroy {

    resolutioncustom: ResolutionCustom;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private resolutioncustomService: ResolutionCustomService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInResolutionCustoms();
    }

    load(id) {
        this.resolutioncustomService.find(id).subscribe((resolutioncustom) => {
            this.resolutioncustom = resolutioncustom;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInResolutionCustoms() {
        this.eventSubscriber = this.eventManager.subscribe(
            'resolutioncustomListModification',
            (response) => this.load(this.resolutioncustom.id)
        );
    }
}
