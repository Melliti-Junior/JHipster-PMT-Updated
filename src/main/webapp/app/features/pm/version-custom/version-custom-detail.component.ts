import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {JhiEventManager} from 'ng-jhipster';

import {VersionCustom} from './version-custom.model';
import {VersionCustomService} from './version-custom.service';

@Component({
    selector: 'jhi-version-custom-detail',
    templateUrl: './version-custom-detail.component.html'
})
export class VersionCustomDetailComponent implements OnInit, OnDestroy {

    versioncustom: VersionCustom;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private versioncustomService: VersionCustomService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInVersionCustoms();
    }

    load(id) {
        this.versioncustomService.find(id).subscribe((versioncustom) => {
            this.versioncustom = versioncustom;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInVersionCustoms() {
        this.eventSubscriber = this.eventManager.subscribe(
            'versioncustomListModification',
            (response) => this.load(this.versioncustom.id)
        );
    }
}
