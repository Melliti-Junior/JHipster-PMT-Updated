import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { Epic } from './epic.model';
import { EpicService } from './epic.service';

@Component({
    selector: 'jhi-epic-detail',
    templateUrl: './epic-detail.component.html'
})
export class EpicDetailComponent implements OnInit, OnDestroy {

    epic: Epic;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private epicService: EpicService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInEpics();
    }

    load(id) {
        this.epicService.find(id).subscribe((epic) => {
            this.epic = epic;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInEpics() {
        this.eventSubscriber = this.eventManager.subscribe(
            'epicListModification',
            (response) => this.load(this.epic.id)
        );
    }
}
