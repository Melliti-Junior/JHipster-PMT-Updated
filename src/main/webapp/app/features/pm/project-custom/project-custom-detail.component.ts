import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { ProjectCustom } from './project-custom.model';
import { ProjectCustomService } from './project-custom.service';

@Component({
    selector: 'jhi-project-custom-detail',
    templateUrl: './project-custom-detail.component.html'
})
export class ProjectCustomDetailComponent implements OnInit, OnDestroy {

    projectcustom: ProjectCustom;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private projectcustomService: ProjectCustomService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInProjectCustoms();
    }

    load(id) {
        this.projectcustomService.find(id).subscribe((projectcustom) => {
            this.projectcustom = projectcustom;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInProjectCustoms() {
        this.eventSubscriber = this.eventManager.subscribe(
            'projectcustomListModification',
            (response) => this.load(this.projectcustom.id)
        );
    }
}
