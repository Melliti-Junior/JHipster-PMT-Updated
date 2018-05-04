import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { CategoryCustom } from './category-custom.model';
import { CategoryCustomService } from './category-custom.service';

@Component({
    selector: 'jhi-category-custom-detail',
    templateUrl: './category-custom-detail.component.html'
})
export class CategoryCustomDetailComponent implements OnInit, OnDestroy {

    categorycustom: CategoryCustom;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private categorycustomService: CategoryCustomService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInCategoryes();
    }

    load(id) {
        this.categorycustomService.find(id).subscribe((categorycustom) => {
            this.categorycustom = categorycustom;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInCategoryes() {
        this.eventSubscriber = this.eventManager.subscribe(
            'categorycustomsListModification',
            (response) => this.load(this.categorycustom.id)
        );
    }
}
